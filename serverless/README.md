
# Serverless API Functions for Text Analysis

This directory contains serverless functions that securely handle API calls to various text analysis services.

## Why Serverless Functions?

- **Security**: API keys are stored as environment variables on the server, not in the client-side code
- **Abstraction**: Frontend only needs to know about one endpoint, not multiple third-party APIs
- **Scalability**: Serverless functions scale automatically with usage
- **Cost-efficiency**: You only pay for actual usage (or stay within free tiers)

## Deployment Options

You can deploy these functions to various serverless platforms:

1. **AWS Lambda + API Gateway**
2. **Vercel Functions**
3. **Netlify Functions**
4. **Google Cloud Functions**
5. **Azure Functions**

## Environment Variables

Set the following environment variables in your serverless platform:

```
PROFANITY_API_KEY=your_profanity_api_key_here
FACT_CHECK_API_KEY=your_fact_check_api_key_here
SCAM_DETECTION_API_KEY=your_scam_detection_api_key_here
ETHICS_API_KEY=your_ethics_api_key_here
ASCII_DETECTION_API_KEY=your_ascii_detection_api_key_here
```

## Getting API Keys

Here are some free or freemium text analysis APIs you can use:

- **Profanity Check**: PurgoMalum (free), Web Purify (freemium)
- **Fact Check**: Google Fact Check API (free with limits), NewsAPI (freemium)
- **Scam Detection**: Consider using PhishTank API or custom ML models
- **Ethics Analysis**: Google Perspective API (free with limits)
- **ASCII Detection**: Typically handled through custom regex patterns

## Deploying to Vercel (Example)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the serverless directory: `cd serverless`
3. Deploy: `vercel`
4. Set environment variables: `vercel env add`

## Deploying to AWS Lambda (Example)

1. Install AWS CLI and configure your credentials
2. Package the function: `zip -r function.zip .`
3. Create Lambda function: `aws lambda create-function --function-name text-analysis --runtime nodejs14.x --handler api/analyze.handler --zip-file fileb://function.zip`
4. Set up API Gateway to expose your Lambda

## Local Development

To test locally:

1. Install serverless frameworks like Vercel CLI or Netlify Dev
2. Create a `.env.local` file with your API keys
3. Run the local development server
4. Update `VITE_API_BASE_URL` in your frontend to point to your local serverless functions

## Production Setup

In production:

1. Deploy the serverless functions to your preferred platform
2. Set all environment variables securely in the platform's dashboard
3. Update the frontend `VITE_API_BASE_URL` to point to your production serverless functions URL
4. Ensure CORS is properly configured to allow requests from your frontend domain
