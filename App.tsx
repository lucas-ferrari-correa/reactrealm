import React, { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, Text, TextInput, View } from 'react-native';
import { getRealm } from './src/database/realm';
import { BSON, Realm } from 'realm';

interface User {
  _id: BSON.ObjectId;
  name: string;
  age: number;
}

export default function App() {
  const [realm, setRealm] = useState<Realm | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedId, setSelectedId] = useState<BSON.ObjectId | null>(null);

  useEffect(() => {
    (async () => {
      const realmInstance = await getRealm();
      setRealm(realmInstance);
      loadUsers(realmInstance);

      // Cleanup
      return () => {
        realmInstance.close();
      };
    })();
  }, []);

  const loadUsers = (realmInstance: Realm) => {
    const data = realmInstance.objects<User>('User');
    setUsers([...data]);
  };

  const handleAddUser = () => {
    if (!name || !age) {return;}

    realm?.write(() => {
      realm.create('User', {
        _id: new BSON.ObjectId(),
        name,
        age: parseInt(age),
      });
    });

    setName('');
    setAge('');
    loadUsers(realm!);
  };

  const handleUpdateUser = () => {
    if (!selectedId) {return;}

    realm?.write(() => {
      const user = realm.objectForPrimaryKey<User>('User', selectedId);
      if (user) {
        user.name = name;
        user.age = parseInt(age);
      }
    });

    setName('');
    setAge('');
    setSelectedId(null);
    loadUsers(realm!);
  };

  const handleDeleteUser = (id: BSON.ObjectId) => {
    realm?.write(() => {
      const user = realm.objectForPrimaryKey<User>('User', id);
      if (user) {
        realm.delete(user);
      }
    });

    loadUsers(realm!);
  };

  const handleSelectUser = (user: User) => {
    setSelectedId(user._id);
    setName(user.name);
    setAge(user.age.toString());
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Realm - CRUD Example
      </Text>

      <View style={{ marginVertical: 16 }}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
          }}
        />
        <TextInput
          placeholder="Age"
          value={age}
          keyboardType="numeric"
          onChangeText={setAge}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
          }}
        />

        {selectedId ? (
          <Button title="Update User" onPress={handleUpdateUser} />
        ) : (
          <Button title="Add User" onPress={handleAddUser} />
        )}
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginVertical: 4,
              backgroundColor: '#f1f1f1',
              borderRadius: 4,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
              <Text style={{ color: '#666' }}>{item.age} years old</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="Edit" onPress={() => handleSelectUser(item)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDeleteUser(item._id)}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
