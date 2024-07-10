import { Sequelize } from 'sequelize';

import { init as initReply, association as replyAssociation } from './reply.model';
import { init as initUser, association as userAssociation } from './user.model';
import {
  init as initUserProfile,
  association as userProfileAssociation,
} from './userProfile.models';
import { init as initPost, association as postAssociation } from './post.model';
import { init as initComment, association as commentAssociation } from './comment.model';
import { init as initImage, association as imageAssociation } from './image.model';

export const initModels = (connection: Sequelize) => {
  initReply(connection);
  initUser(connection);
  initUserProfile(connection);
  initPost(connection);
  initComment(connection);
  initImage(connection);

  associations();
};

const associations = () => {
  replyAssociation();
  userAssociation();
  userProfileAssociation();
  postAssociation();
  imageAssociation();
  commentAssociation();
};
