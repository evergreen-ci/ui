db.admin.insertOne({ "_id": "runtime_environments", "base_url": `${process.env.STAGING_RUNTIME_ENVIRONMENTS_BASE_URL}`, "api_key": `${process.env.STAGING_RUNTIME_ENVIRONMENTS_API_KEY}` })
