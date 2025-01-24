# Hugging Face for Business

## Overview
This project is a machine learning platform designed to provide a business-friendly interface for interacting with machine learning models, repositories, and workflows. The platform leverages **SvelteKit** for both frontend and backend (server-side), **MongoDB** for data storage, and **Hugging Face** for machine learning integration. The infrastructure is hosted on **AWS**, ensuring scalability, security, and reliability.

## Architecture

### Technical Stack
- **Frontend & Backend:** SvelteKit (full-stack framework)
  - Server-side API routes for backend functionality
  - Server-side rendering (SSR) for improved SEO and performance
  - WebSocket integration for real-time monitoring
- **Database:** MongoDB
  - Document store for flexible model metadata
  - Time-series collections for metrics storage
  - Redis caching layer for performance optimization
- **Infrastructure:** AWS
  - ECS with Fargate for containerized deployment
  - S3 for model artifact storage
  - CloudFront CDN for global content delivery
  - CloudWatch for logging and monitoring
- **ML Integration:** Hugging Face
  - Inference API for model predictions
  - Model Hub API for repository browsing
  - Spaces API for deployment options

### System Architecture
```mermaid
graph TD
    Client[Client Browser] --> CDN[CloudFront CDN]
    CDN --> App[SvelteKit App]
    App --> Auth[Authentication Layer]
    App --> API[API Layer]
    API --> DB[(MongoDB)]
    API --> Cache[(Redis Cache)]
    API --> HF[Hugging Face APIs]
    API --> S3[AWS S3]
```

## MVP Features

### 1. **User Authentication**
- **Sign-up, Login, and Profile Management:** Users can create accounts, log in, and manage their profiles.
- **Authentication:** JWT-based authentication with refresh token rotation
- **Security:** 
  - Rate limiting on API endpoints
  - CSRF protection
  - Secure session management

### 2. **Model Browsing and Search**
- **Model Repository:** Users can browse and search machine learning models from Hugging Face's ML Hub.
- **Search Functionality:** 
  - Real-time search with debouncing
  - Advanced filtering options
  - Cached search results
  - Pagination support

### 3. **Model Deployment and Inference**
- **Model Deployment:** 
  - One-click deployment to AWS Lambda or Hugging Face Spaces
  - Automatic scaling configuration
  - Version management
- **Inference API:** 
  - REST API endpoints for model inference
  - Batch prediction support
  - Request/Response validation
  - Error handling and retry logic

### 4. **Monitoring and Analytics**
- **Basic Monitoring:** 
  - Real-time performance metrics via WebSocket
  - Latency tracking
  - Error rate monitoring
  - Resource utilization metrics
- **Usage Analytics:** 
  - Detailed logs with structured data
  - Custom dashboard with filterable metrics
  - Export functionality for reports

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- AWS Account with appropriate IAM permissions
- Hugging Face API Key

### Development Environment Setup
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/guillearria/huggingface-for-business.git
   cd huggingface-for-business
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   The project uses environment variables for configuration. These are not tracked in git for security reasons.

   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

   Then edit `.env` with your specific values:
   ```env
   # App
   PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/hf-business
   REDIS_URL=redis://:devpassword@localhost:6379
   REDIS_PASSWORD=devpassword

   # Authentication
   JWT_SECRET=your-jwt-secret          # Change this!
   JWT_REFRESH_SECRET=your-refresh-secret  # Change this!
   
   # External Services
   HUGGING_FACE_API_KEY=your-hugging-face-api-key
   
   # AWS (for production)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   ```

   **Important Security Notes:**
   - Never commit `.env` file to version control
   - Generate strong secrets for JWT tokens
   - Keep your API keys secure
   - In production, use a secure secrets management service

4. **Start Local Services:**
   The project uses Docker Compose to manage local development services (MongoDB and Redis).
   ```bash
   # Start services in detached mode
   docker-compose up -d

   # Verify services are running
   docker-compose ps

   # View service logs
   docker-compose logs -f

   # Stop services
   docker-compose down

   # Stop services and remove volumes
   docker-compose down -v
   ```

   **Service Details:**
   - MongoDB runs on `localhost:27017`
     - Database name: `hf-business`
     - No authentication required for local development
   - Redis runs on `localhost:6379`
     - Protected with password (default: `devpassword`)
     - Persistence enabled with AOF (Append-Only File)

5. **Run Development Server:**
   ```bash
   # Start development server with hot reload
   npm run dev
   ```

6. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`

### Troubleshooting Local Services

1. **Check Service Status:**
   ```bash
   # View service status
   docker-compose ps

   # View service logs
   docker-compose logs mongodb
   docker-compose logs redis
   ```

2. **Reset Services:**
   ```bash
   # Stop services and remove containers
   docker-compose down

   # Remove volumes if you want to clear all data
   docker-compose down -v

   # Restart services
   docker-compose up -d
   ```

3. **Common Issues:**
   - If MongoDB fails to start, ensure port 27017 is not in use
   - If Redis fails to start, ensure port 6379 is not in use
   - If services are unhealthy, check logs for specific errors

### Testing Local Services

1. **Verify Services are Running:**
   ```bash
   # Check running containers and their health status
   docker ps
   ```
   Expected output should show both containers running and "healthy"

2. **Test MongoDB Connection:**
   ```bash
   # Connect to MongoDB container
   docker exec -it hf-business-mongodb mongosh
   
   # Once connected, test the database
   show dbs
   use hf-business
   db.version()
   
   # Create a test document
   db.test.insertOne({ message: "Hello MongoDB" })
   db.test.find()
   
   # Exit MongoDB shell
   exit
   ```

3. **Test Redis Connection:**
   ```bash
   # Connect to Redis container
   docker exec -it hf-business-redis redis-cli
   
   # Authenticate (using default password)
   auth devpassword
   
   # Test connection
   ping
   
   # Test data operations
   set test "Hello Redis"
   get test
   
   # Exit Redis CLI
   exit
   ```

4. **View Service Logs:**
   ```bash
   # View MongoDB logs
   docker logs hf-business-mongodb
   
   # View Redis logs
   docker logs hf-business-redis
   
   # Follow logs in real-time (add -f flag)
   docker logs -f hf-business-mongodb
   docker logs -f hf-business-redis
   ```

5. **Expected Results:**
   - MongoDB:
     - Should connect without authentication
     - Database operations should work
     - No connection errors in logs
   - Redis:
     - Should authenticate with password
     - PING should return PONG
     - Data operations should work
     - No connection errors in logs

### Production Deployment
1. **Build the Application:**
   ```bash
   npm run build
   ```

2. **Deploy to AWS:**
   ```bash
   # Using AWS CDK or similar IaC tool
   npm run deploy
   ```

## Future Developments

### 1. **Collaboration Tools**
- **Forking and Pull Requests:** Allow users to fork models and submit pull requests for collaboration.
- **Role-Based Access Control:** Implement role-based access control for teams and organizations.

### 2. **Advanced Model Management**
- **Model Training:** Integrate with AWS SageMaker for advanced model training.
- **Version Control:** Implement version control for models to track changes and updates.

### 3. **Enhanced Monitoring and Analytics**
- **Advanced Metrics:** Provide more detailed metrics and analytics for model performance.
- **Alerting System:** Implement an alerting system for model performance issues.

### 4. **User Interface Improvements**
- **Dashboard:** Create a comprehensive dashboard for users to manage models, deployments, and analytics.
- **Customizable Views:** Allow users to customize their views and preferences.

### 5. **Integration with Additional Services**
- **Other ML Hubs:** Integrate with other machine learning hubs and services.
- **Third-Party APIs:** Add support for third-party APIs and services.

### 6. **Scalability and Performance Enhancements**
- **Serverless Architecture:** Further leverage AWS Lambda for serverless functions.
- **Global CDN:** Enhance global content delivery using AWS CloudFront.

## Contributing
Contributions are welcome and appreciated. Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or support, please connect with Guillermo Arria-Devoe on [LinkedIn](https://www.linkedin.com/in/guillearria/).