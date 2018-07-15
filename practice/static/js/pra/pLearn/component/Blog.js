import React, { Component } from 'react'

function SideBar(props) {
    return (
        <ul>
            {
                props.posts.map(post =>
                    <li key={post.id}>
                        <h3>{post.title}</h3>
                    </li>
                )
            }
        </ul>
    );
}

function Content(props) {
    return (
        props.posts.map(post =>
            <div key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
            </div>
        )
    );
}

class Blog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            theme:'list'
        }
    }

    render() {
        return (
            <div>
                <SideBar posts={this.props.posts} />
                <hr />
                <Content posts={this.props.posts} />
            </div>
        );
    }
}

export default Blog;