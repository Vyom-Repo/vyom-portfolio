/**
 * Vercel Serverless Function: GitHub Contribution API
 * 
 * Securely fetches GitHub contribution graph data using a Personal Access Token
 * stored in Vercel Environment Variables (`GITHUB_TOKEN`), completely hiding
 * the token from the frontend client.
 */

module.exports = async function(req, res) {
  // 1. Secure Token Retrieval
  // The token MUST be configured in Vercel Dashboard > Project Settings > Environment Variables
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    return res.status(500).json({ 
      error: "Server Configuration Error: Missing GITHUB_TOKEN environment variable." 
    });
  }

  // 2. Dynamic Username Config
  // Extracted from query string (e.g. /api/github?username=Vyom-Repo)
  const username = req.query.username;
  
  if (!username) {
    return res.status(400).json({ 
      error: "Bad Request: Missing 'username' query parameter." 
    });
  }

  // 3. Official GraphQL Query
  // Tailored to fetch exactly what is required for the grid rendering.
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    // 4. Secure Fetch to GitHub API
    // Uses Node 18+ native fetch
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Serverless-Function' // Good practice for GitHub API
      },
      body: JSON.stringify({ query })
    });

    // Handle HTTP Rate Limits or bad tokens from GitHub (401, 403, 429)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API HTTP Error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        return res.status(401).json({ error: "Unauthorized: Invalid GitHub Token" });
      } else if (response.status === 403 || response.status === 429) {
        return res.status(429).json({ error: "Rate Limit Exceeded" });
      }
      return res.status(response.status).json({ error: "GitHub API Error" });
    }

    const result = await response.json();

    // Handle GraphQL-level Errors (e.g., Invalid Username)
    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL Error:', result.errors);
      return res.status(404).json({ error: result.errors[0].message });
    }

    // 5. Payload Minimization
    // Extract only the necessary data to prevent massive payloads.
    const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!calendar || !calendar.weeks) {
      return res.status(500).json({ error: "Malformed response structure from GitHub" });
    }

    // 6. Successful Response
    return res.status(200).json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks
    });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: "Failed to connect to GitHub API." });
  }
};
