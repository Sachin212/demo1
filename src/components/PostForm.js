import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../utils/hooks'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

function PostForm(){
    const { value, onChange, onSubmit } = (useForm)(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: value,
        update(proxy, result){
            // console.log(result)
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            // data.getPosts = [result.data.createPost, ...data.getPosts]

            // console.log(value)
            proxy.writeQuery({ 
                query : FETCH_POSTS_QUERY, 
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            })
            value.body = ''
        }
    })

    function createPostCallback(){
        createPost()
    }

    return(
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World!"
                        name="body"
                        onChange={onChange}
                        value={value.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm