import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback, Alert
} from "react-native";
import {ListItem, Avatar, Icon, FAB} from "react-native-elements";
import axios from "axios";
import ModalInput from "../components/ModalInput";

const Posts = (props) => {
  //Init State
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalEditVisible, setModalEditVisible] = useState(false)
  const [modalCreateVisible, setModalCreateVisible]  = useState(false)

  useEffect(() => {
    //Function Get Post
    getPost();
  }, []);

  const list = [
    {
      title: 'Edit',
      icon: 'edit',
      onPress: () => {
        setModalVisible(false)
        // props.navigation.navigate("PostDetail", selectedItem)
        setModalEditVisible(true)
      }
    },
    {
      title: 'Delete',
      icon: 'delete',
      onPress: async () => {
        try {
          setModalVisible(false)
          setIsLoading(true)
          await axios.delete(`https://jsonplaceholder.typicode.com/posts/${selectedItem.id}`)
          const tempPost = post.filter(p => p.id !== selectedItem.id)
          setPost(tempPost)
          setIsLoading(false)
          Alert.alert(`Post "${selectedItem.title}" deleted!`)
        } catch(err) {
          Alert.alert('Error while deleting process, please try again.')
          setIsLoading(false)
        }
      }
    }
  ]

  const getPost = () => {
    setIsLoading(true);
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        // console.log(res.data);
        setPost(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        alert("Error Fetch Data");
        setIsLoading(false);
      });
  };

  const visibleModal = (isVisible, item) => {
    setSelectedItem(item)
    setModalVisible(isVisible)
  }

  const _renderItem = ({ item }) => {
    return (
      <ListItem
        onPress={() => props.navigation.navigate("PostDetail", item)}
        onLongPress={() => visibleModal(true, item)}
        key={item.id.toString()}
        bottomDivider
      >
        <Avatar
          rounded
          title={item.title.slice(0, 2)}
          containerStyle={{ backgroundColor: "black" }}
        />
        <ListItem.Content>
          <ListItem.Title h4 numberOfLines={1}>
            {item.title}
          </ListItem.Title>
          <ListItem.Subtitle numberOfLines={2}>{item.body}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {
            list.map((item, i) => (
                <ListItem onPress={item.onPress} key={i} bottomDivider>
                  <Icon name={item.icon} />
                  <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
            ))
          }
        </View>
      </Modal>
      <View style={styles.top}>
        <FlatList
          data={post}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isLoading}
          onRefresh={getPost}
        />
      </View>
      <StatusBar style="auto" />
      <FAB
          placement={"right"}
          icon={() => <Icon name='add' color='white' />}
          color='blue'
          onPress={() => setModalCreateVisible(true)}
          upperCase
      />
      <ModalInput
        item={selectedItem}
        visible={modalEditVisible}
        toggleModal={() => setModalEditVisible(!modalEditVisible)}
        onEdit={(item) => {
          const tempItem = post.map(p => p.id === item.id ? item : p)
          setPost(tempItem)
        }}
      />
      <ModalInput
          visible={modalCreateVisible}
          toggleModal={() => setModalCreateVisible(!modalCreateVisible)}
          onCreate={(item) => {
            const newItem = post.reverse()
            newItem.push(item)
            setPost(newItem.reverse())
          }}
      />
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 20
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 100,
    fontWeight: "bold",
  },
  top: {
    flex: 5,
  },
  bottom: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  titleItem: {
    fontWeight: "bold",
  },
});
