export default class FavoritesRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getById = async (id) => await this.dao.getById(id);
    getByUserId = async (userId) => await this.dao.getByUserId(userId);
    create = async (data) => await this.dao.create(data);
    update = async (id, data) => await this.dao.update(id, data);
}