class Animation {
  constructor(imageFolder, pref, numImages) {
    this.numImages = numImages;
    this.imagePaths = new Array(numImages).fill().map((temp, i) =>
      `${imageFolder}/${pref}${i}.png`
    );
    this.images = new Array(numImages);
    this.currentFrame = 0;
    this.isComplete = false;
    this.loadImages();
  }

  loadImages() {
    for (let i = 0; i < this.numImages; i++) {
      this.images[i] = loadImage(this.imagePaths[i]);
    }
  }

  next() {
    this.currentFrame++;
    if (this.currentFrame == this.numImages) {
      this.isComplete = true;
      this.currentFrame = 0;
    }
  }

  reset() {
    this.isComplete = false;
    this.currentFrame = 0;
  }

  renderFrame(x, y) {
    let frame = this.images[this.currentFrame];
    image(frame, x, y, frame.width, frame.height);
  }
}
