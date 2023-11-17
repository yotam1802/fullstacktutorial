import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'

function Post() {
    let {id} = useParams()
    const [postObject, setPostObject] = useState({})
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const {authState} = useContext(AuthContext)

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`)
            .then((response) => {
                setPostObject(response.data)
            })
        
        axios.get(`http://localhost:3001/comments/${id}`)
            .then((response) => {
                setComments(response.data)
            })
    }, [])

    const addComment = () => {
        axios.post(`http://localhost:3001/comments`, {commentBody: newComment, PostId: id}, {headers: {accessToken: localStorage.getItem('accessToken')}})
            .then((response) => {
                if (response.data.Error) {
                    alert(response.data.Error)
                } else {
                    setComments(comments.concat(response.data))
                    setNewComment('')
                }
            })
    }

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, {headers: {accessToken: localStorage.getItem("accessToken")}})
            .then((response) => {
                setComments(comments.filter((comment) => comment.id !== id))
            })
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title">{postObject.title}</div>
                    <div className="body">{postObject.postText}</div>
                    <div className="footer">{postObject.username}</div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" placeholder="Comment..." autoComplete="off" onChange={(event) => {setNewComment(event.target.value)}} value={newComment}/>
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div className='comment' key={key}>
                                {comment.commentBody}
                                <label> Username: {comment.username}</label>
                                {authState.username === comment.username ? 
                                    <button onClick={() => deleteComment(comment.id)}>X</button>
                                : null
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Post
