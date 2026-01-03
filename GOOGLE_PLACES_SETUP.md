# Google Places API Setup Guide

This guide will help you set up Google Places API to get **unlimited real restaurant data** across the entire USA (and worldwide).

## Current Status

Without an API key, the app uses **mock data** with 64 curated restaurants in:
- San Francisco (25 restaurants)
- Houston (21 restaurants)
- Dallas/Fort Worth (18 restaurants)

## With Google Places API

Once configured, you'll have access to **millions of real restaurants** across the USA and worldwide!

---

## Step 1: Get Your Google Cloud API Key

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create or Select a Project
- Click the project dropdown at the top
- Click "NEW PROJECT"
- Name it (e.g., "Restaurant Finder")
- Click "CREATE"

### 1.3 Enable Places API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Places API"
3. Click on **"Places API"**
4. Click **"ENABLE"**

### 1.4 Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Your API key will be created and displayed
4. **Copy the API key** (you'll need it in the next step)

### 1.5 (Optional) Restrict Your API Key
For security, you can restrict your API key:
1. Click "EDIT API KEY" (or the pencil icon)
2. Under "API restrictions", select "Restrict key"
3. Check **"Places API"**
4. Click "SAVE"

---

## Step 2: Add API Key to Your App

### 2.1 Edit .env.local File
Open the file `.env.local` in the project root.

### 2.2 Add Your API Key
Uncomment and replace the API key line:

```bash
# Before:
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# After:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB1234567890abcdefg_YOUR_ACTUAL_KEY_HERE
```

### 2.3 Save the File

---

## Step 3: Restart Your Development Server

If your dev server is running, restart it:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 4: Test It Out!

1. Open your app: http://localhost:3000
2. Search for **any city in the USA** (or worldwide!)
   - Try: "New York", "Los Angeles", "Chicago", "Miami", etc.
3. You should now see **real restaurants** from Google Places!

The app will automatically:
- ✅ Use **Google Places** when API key is configured
- ✅ Fallback to **mock data** if API key is missing or invalid
- ✅ Show data source in API response (`google_places` or `mock_data`)

---

## Pricing Information

### Google Places API Pricing:
- **Free tier**: $200/month credit (enough for ~11,000 requests)
- **Cost**: ~$17 per 1,000 requests
- Most hobby projects stay within the free tier!

### How to Monitor Usage:
1. Go to: https://console.cloud.google.com/
2. Navigate to **Billing** → **Reports**
3. View your API usage and costs

---

## Troubleshooting

### "API key not configured" Error
- Make sure you've added the key to `.env.local`
- Restart your dev server after adding the key
- Check that the key is uncommented (no `#` at the start)

### "Places API has not been enabled" Error
- Go to Google Cloud Console
- Enable "Places API" for your project

### Getting Mock Data Instead of Real Data
- Verify API key is correctly set in `.env.local`
- Check browser console for API errors
- Verify Places API is enabled in Google Cloud

### Rate Limit Errors
- You may have exceeded your quota
- Check your Google Cloud Console billing/usage

---

## Features Available with Google Places

Once configured, you'll get:
- ✅ **Millions of restaurants** worldwide
- ✅ **Real-time data** (ratings, hours, status)
- ✅ **Accurate information** (addresses, phones, etc.)
- ✅ **Search anywhere** in the USA and beyond
- ✅ **Up-to-date hours** and opening status
- ✅ **User reviews** and ratings from Google

---

## Example Cities to Try

Once your API key is configured, try searching:
- **Major cities**: New York, Los Angeles, Chicago, Houston, Phoenix
- **Tourist destinations**: Orlando, Las Vegas, San Diego, New Orleans
- **Small towns**: Works anywhere with restaurants!
- **International**: London, Tokyo, Paris (works worldwide!)

---

## Need Help?

- **Google Places API Docs**: https://developers.google.com/maps/documentation/places/web-service
- **API Key Help**: https://developers.google.com/maps/documentation/places/web-service/get-api-key
- **Pricing Calculator**: https://mapsplatform.google.com/pricing/

Enjoy your unlimited restaurant data! 🍽️✨
