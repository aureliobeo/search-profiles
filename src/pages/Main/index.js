import AsyncStorege from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Keyboard, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import {
  Avatar,
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
    console.log(this.props);
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
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuario"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <Button
            title="Add"
            size={20}
            color="#7159c1"
            onPress={this.handleAddUser}
          >
            {' '}
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Button name="add" size={20} color="#FFF" />
            )}
          </Button>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <Button
                title="Ver Perfil"
                onPress={() => this.handleNavigate(item)}
              />
              <Button
                title="Remover"
                onPress={() => this.handleRemoveUser(item)}
                size={20}
                color="#7159c1"
              />
            </User>
          )}
        />
      </Container>
    );
  }
}

Main.propTypes = propTypes;
