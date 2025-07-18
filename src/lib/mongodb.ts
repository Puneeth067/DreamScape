import mongoose from 'mongoose';

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: Cached = {
  conn: null,
  promise: null,
};

export async function connectDB() {
  // Check if we already have a connection
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  // Validate MongoDB URI
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  // Only create a new promise if one isn't already in progress
  if (!cached.promise) {

    console.log('Initiating new MongoDB connection...');
    
    try {
      // Test the MongoDB URI format
      const validUri = MONGODB_URI.startsWith('mongodb://') || 
                      MONGODB_URI.startsWith('mongodb+srv://');
                      
      if (!validUri) {
        throw new Error('Invalid MongoDB URI format');
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('MongoDB URI validation error:', errorMessage);
      throw new Error(`MongoDB URI validation failed: ${errorMessage}`);
    }
  }

  try {
    cached.conn = await cached.promise;
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    return cached.conn;
  } catch (error: unknown) {
    cached.promise = null;
    
    // Provide specific error messages based on error type
    let errorMessage = 'MongoDB connection failed: ';
    
    if (typeof error === 'object' && error !== null) {
      const err = error as { code?: string; name?: string; message?: string };
      if (err.code === 'ECONNREFUSED') {
        errorMessage += 'Connection refused. Please check if MongoDB is running and accessible.';
      } else if (err.name === 'MongoServerSelectionError') {
        errorMessage += 'Could not connect to any servers in your MongoDB cluster. Check your connection string and network connectivity.';
      } else if (err.name === 'MongoParseError') {
        errorMessage += 'Invalid connection string format.';
      } else if (err.name === 'MongooseServerSelectionError') {
        errorMessage += `Server selection timed out after ${opts.serverSelectionTimeoutMS}ms. Check if your MongoDB server is running and accessible.`;
      } else {
        errorMessage += err.message || String(error);
      }
    } else {
      errorMessage += String(error);
    }

    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}