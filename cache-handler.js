class CloudflareCacheHandler {
  constructor(options) {
    this.options = options;
    this.cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
    this.cloudflareZone = process.env.CLOUDFLARE_ZONE;
  }

  async get(key, fetchCache) {
    // 基本的なキャッシュ取得（簡易実装）
    return null;
  }

  async set(key, data, ctx) {
    // Cloudflareのキャッシュヘッダーを設定するための情報を保存
    if (this.cloudflareApiToken && this.cloudflareZone && ctx?.revalidate) {
      // revalidateの設定がある場合、その情報を記録
      console.log(`Cache set for key: ${key}, revalidate: ${ctx.revalidate}`);
    }
    
    return Promise.resolve();
  }

  async revalidateTag(tag) {
    console.log(`Revalidating tag: ${tag}`);
    
    // Cloudflare APIを使ってキャッシュをパージ
    if (this.cloudflareApiToken && this.cloudflareZone) {
      try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.cloudflareZone}/purge_cache`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.cloudflareApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tags: [tag]
          })
        });

        if (!response.ok) {
          console.error('Failed to purge Cloudflare cache:', await response.text());
        } else {
          console.log(`Successfully purged Cloudflare cache for tag: ${tag}`);
        }
      } catch (error) {
        console.error('Error purging Cloudflare cache:', error);
      }
    }

    return Promise.resolve();
  }

  async revalidatePath(pathname, type) {
    console.log(`Revalidating path: ${pathname}, type: ${type}`);
    
    // Cloudflare APIを使って特定のパスのキャッシュをパージ
    if (this.cloudflareApiToken && this.cloudflareZone) {
      try {
        const purgeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hagetter.hansode.club'}${pathname}`;
        
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.cloudflareZone}/purge_cache`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.cloudflareApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: [purgeUrl]
          })
        });

        if (!response.ok) {
          console.error('Failed to purge Cloudflare cache:', await response.text());
        } else {
          console.log(`Successfully purged Cloudflare cache for path: ${pathname}`);
        }
      } catch (error) {
        console.error('Error purging Cloudflare cache:', error);
      }
    }

    return Promise.resolve();
  }
}

module.exports = CloudflareCacheHandler;