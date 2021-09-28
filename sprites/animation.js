class Animation {
  constructor(imageFolder, pref, numImages) {
    this.numImages = numImages;
    this.imagePaths = new Array(numImages).fill().map((temp, i) =>
      `${imageFolder}/${pref}${i}.png`
    );
    this.images = new Array(numImages);
    this.currentFrame = 0;
  }

  loadImages() {
    for (let i = 0; i < this.numImages; i++) {
      this.images[i] = loadImage(this.imagePaths[i]);
    }
  }

  next(pos) {
    let frame = this.images[this.currentFrame];
    image(frame, pos.x, pos.y, frame.width * 2, frame.height * 2);
    this.currentFrame = (this.currentFrame + 1) % this.numImages;
  }
}
