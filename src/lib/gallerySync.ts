type GallerySubscriber = (index: number) => void;

class GallerySyncManager {
  private currentIndex = 0;
  private subscribers: GallerySubscriber[] = [];
  private timer: NodeJS.Timeout | null = null;
  private imageCount = 0;

  startSync(imageCount: number) {
    // Use the first imageCount provided, or update if no timer exists yet
    if (!this.timer) {
      this.imageCount = imageCount;
    }
    
    if (this.timer || this.imageCount <= 1) return;

    this.timer = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.imageCount;
      this.notifySubscribers();
    }, 5000);
  }

  subscribe(callback: GallerySubscriber) {
    this.subscribers.push(callback);
    // Immediately call with current index
    callback(this.currentIndex);
    
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
      if (this.subscribers.length === 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentIndex));
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
}

export const gallerySyncManager = new GallerySyncManager();