import AsyncStorege from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { Button, Card, Text, Avatar, Badge, withBadge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import {

  Bio,
  Container,
  Form,
  Input,
  List,
  Name,
  User,
} from './styles';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      newUser: '',
      users: [],
      loading: false,
    };
  }

  async componentDidMount() {
    const users = await AsyncStorege.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  async componentDidUpdate(_, prevState) {
    const { users } = this.state;
    if (prevState.users !== users) {
      await AsyncStorege.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    let userAlreadyExists = false;

    users.forEach(user => {
      if (user.login === newUser) {
        userAlreadyExists = true;
      }
    });

    if (userAlreadyExists) {
      return;
    }

    this.setState({ loading: true });

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      users: [...users, data],
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();
  };

  handleNavigate = users => {
    const { navigation } = this.props;

    navigation.navigate('User', { users });
  };

  handleRemoveUser = user => {
    let { users } = this.state;

    users = users.filter(userFiltered => userFiltered.login !== user.login);

    this.setState({
      users: [...users],
    });
  };

  static navigationOptions = {
    title: 'Usuarios',
  };

  render() {
    const { users, newUser, loading } = this.state;
    return (
      <Container>
        <Form>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Adicionar usuario"
                value={newUser}
                onChangeText={text => this.setState({ newUser: text })}
                returnKeyType="send"
                onSubmitEditing={this.handleAddUser}
              />
            </View>
            <View>
              {loading ? (
                <Button loading
                  buttonStyle={{ backgroundColor: '#7159c1' }}
                  color="#7159c1"
                  icon={<Icon
                    name="arrow-right"
                    size={25}
                    color="white" />
                  } />
              ) : (
                  <Button type="solid"
                    buttonStyle={{ backgroundColor: '#7159c1' }}
                    color="#7159c1"
                    onPress={this.handleAddUser}
                    icon={<Icon name="add" size={25} color="white" />} />
                )}
            </View>
          </View>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <Card>
              <User>
                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                  <Button
                    type="clear"
                    onPress={() => this.handleRemoveUser(item)}
                    icon={<Icon name="delete" size={30} color="red" />}
                  />
                </View>
                <Avatar source={{ uri: item.avatar }}
                  onPress={() => this.handleNavigate(item)}
                  size="large" rounded title="LW" />
                <Name>{item.name}</Name>
                <Bio>{item.bio}</Bio>
              </User>
            </Card>
          )}
        />
      </Container>
    );
  }
}

Main.propTypes = propTypes;
