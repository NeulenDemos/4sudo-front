import React from 'react'

const styles = {
    title: {color: "#000", fontSize: "20px"},
    content : {color: "#333333", marginTop: "10px", fontSize: "13px"}
}

function getDateString(str) {
    let date = new Date(str);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
}

function getRatingClass(likes) {
    if (likes > 10)
        return "ratingGold";
    else if (likes > 0)
        return "ratingGreen";
    else if (likes === 0)
        return "ratingGrey";
    return "ratingRed";
}

function getRatingText(likes) {
    if (likes >= 0)
        return `${likes} Likes`;
    return `${-likes} Dislikes`
}

const testTags = ["Android", "Windows", "MacOS", "Sloshna", "Geek"]

export const Posts = ({posts}) => (
    <div className="container" style={{marginLeft: "auto", marginRight: "auto", width: "1000px"}}>
        <div className="list-group">
            {posts ? posts.map(post => (
                <a href="#" className="list-group-item list-group-item-action" aria-current="true">
                    <div className="d-flex w-100 justify-content-between post-header">
                        <h5 className="mb-1">{post.title}</h5>
                        <small>{getDateString(post.created_at)}</small>
                    </div>
                    <div className="tags">
                        {testTags ? testTags.map(tag => (
                            <span className="tag">{tag}</span>
                        )) : null}
                    </div>
                    <p className="mb-1">{post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}</p>
                    <small className={getRatingClass(post.rating) + " rating"}>{getRatingText(post.rating)}</small>
                </a>
            )) : null}
        </div>
    </div>
)