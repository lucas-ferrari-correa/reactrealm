import Realm from 'realm';
import { User, Post, Comment } from './schema';

export const getRealm = async () => {
  return await Realm.open({
    schema: [User, Post, Comment],
    schemaVersion: 1,
  });
};
