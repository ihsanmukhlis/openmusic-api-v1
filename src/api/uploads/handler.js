const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.addAlbumCover(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
