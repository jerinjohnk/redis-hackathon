import userModel from './user';
import channelModel from './channel';
import messageModel from './message';
import teamModel from './team';

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('messenger', 'postgres', 'postgres', {
  dialect: 'postgres',
  define: {
    underscored: true,
  },
});

const models = {
  User: userModel(sequelize, DataTypes),
  Channel: channelModel(sequelize, DataTypes),
  Message: messageModel(sequelize, DataTypes),
  Team: teamModel(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
