const { Op } = require("sequelize");
const Publisher = require("./schemas/PublisherSchema");
const Book = require('./BookUtils')
Publisher.createPublisher = async function (publisher) {
  return await Publisher.create(publisher);
};

Publisher.getPublisherById = async function (publisherId) {
  const publisherFound = await Publisher.findOne({
    where: { id: publisherId },
  });
  if (!publisherFound) throw new Error("There is no publisher with such ID,");
  return publisherFound;
};

Publisher.getPublisherByName = async function (publisherName) {
  const name = publisherName.trim().split("").join("%");
  const publisherFound = await Publisher.findAll({
    where: {
      publisherName: { [Op.iLike]: `%${name}%` },
    },
  });
  return publisherFound;
};

Publisher.updatePublisher = async function (publisherId, updatesObj) {
  return await Publisher.update(updatesObj, {
    where: {
      id: publisherId,
    },
    returning: true,
  });
};

Publisher.deletePublisher = async function (publisherId) {
  return await Publisher.destroy({ where: { id: publisherId } });
};

module.exports = Publisher;
