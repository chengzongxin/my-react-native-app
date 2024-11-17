import Realm from 'realm';

export class Movie extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  path!: string;
  thumbnail!: string | null;
  createAt!: Date;
  updateAt!: Date;
  
  static schema: Realm.ObjectSchema = {
    name: 'Movie',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      path: 'string',
      thumbnail: 'string?',
      createAt: 'date',
      updateAt: 'date'
    }
  };
} 