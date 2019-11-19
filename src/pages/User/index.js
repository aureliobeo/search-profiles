import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';
import { ButtonGroup, Text, Button, Icon } from 'react-native-elements';
import {ActivityIndicator} from 'react-native'

const propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('users').name,
  });

  constructor() {
    super();
    this.state = {
      user: null,
      stars: [],
      repositories: [],
      loading: true,
      selectedIndex: 0
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('users');

    const starredRepositories = await api.get(`/users/${user.login}/starred`);

    const userRepositories = await api.get(`/users/${user.login}/repos`);

    this.setState({
      stars: starredRepositories.data,
      user,
      repositories: userRepositories.data,
      loading: false,
    });
  }

  async favorito() {
    const { stars, repositories, user, loading } = this.state;

    <Stars
      data={stars}
      keyExtractor={star => String(star.id)}
      renderItem={({ item }) => (
        <Starred>
          <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
          <Info>
            <Title>{item.name}</Title>
            <Author>{item.owner.login}</Author>
          </Info>
        </Starred>
      )}
    />
  }

  changeButtonIndex(selectedIndex) {
    this.setState({
      selectedIndex
    });
  }

  render() {
    const { stars, repositories, user, loading, selectedIndex } = this.state;

    const component2 = () => <Text>Starred</Text>
    const component3 = () => <Text>Repositories</Text>

    const buttons = [{ element: component2 }, { element: component3 }]

    if (loading) {
      return (
        <Container>
          <ActivityIndicator size="large" color="#0000ff"/>
        </Container>
      );
    }

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <ButtonGroup
          onPress={(index) => {
            this.changeButtonIndex(index);
          }}
          selectedIndex={selectedIndex}
          buttons={buttons}>
        </ButtonGroup>
        {selectedIndex == 0 ? (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        ) : (
            <Stars
              data={repositories}
              keyExtractor={repository => String(repository.id)}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
      </Container>
    );
  }
}

User.propTypes = propTypes;
