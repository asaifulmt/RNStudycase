import React, {useEffect, useState} from 'react'
import {Alert, Text, View} from "react-native";
import {Input, Overlay, Button} from "react-native-elements";
import axios from "axios";


export default function ModalInput(props) {
    const [item, setItem] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (props.item) {
            setItem(props.item)
        }
    }, [props.item])

    const newPost = async () => {
        try {
            setIsLoading(true)
            const resp = await axios.post('https://jsonplaceholder.typicode.com/posts', { ...item, userId: 1 })
            setIsLoading(false)
            props.onCreate(resp.data)
            setItem({})
            props.toggleModal()
        } catch(err) {
            console.log(err)
            setIsLoading(false)
            Alert.alert('Something went wrong with the server, please try again.')
        }
    }

    const editPost = async () => {
        try {
            setIsLoading(true)
            const resp = await axios.put(`https://jsonplaceholder.typicode.com/posts/${item.id}`, item)
            setIsLoading(false)
            props.onEdit(resp.data)
            props.toggleModal()
        } catch (err) {
            console.log(err)
            setIsLoading(false)
            Alert.alert('Something went wrong with the server, please try again.')
        }
    }

    return (
        <Overlay isVisible={props.visible} onBackdropPress={props.toggleModal} overlayStyle={{ width: '100%' }}>
            <Input label='Title' value={item.title} onChangeText={val => setItem({ ...item, title: val })} />
            <Input label='Body' value={item.body} onChangeText={val => setItem({ ...item, body: val })} />
            {
                props.onEdit && (
                    <Button
                        title="Save changes"
                        onPress={editPost}
                        buttonStyle={{ marginBottom: 10 }}
                        loading={isLoading}
                    />
                )
            }
            {
                props.onCreate && (
                    <Button
                        title="New post"
                        onPress={newPost}
                        buttonStyle={{ marginBottom: 10 }}
                        loading={isLoading}
                    />
                )
            }
            <Button
                buttonStyle={{ backgroundColor: 'red' }}
                title="Cancel"
                onPress={props.toggleModal}
            />
        </Overlay>
    )
}
