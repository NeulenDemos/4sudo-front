<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use App\Models\Comments;
use App\Models\Likes;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    public function getAll()
    {
        $query = Posts::query();
        $result = $query->get('*');
        return $result;
    }
    public function get($id)
    {
        $query = Posts::query();
        $result = $query->where('id', '=', $id)->get('*');
        return $result;
    }
    public function getComments($id)
    {
        $query = Comments::query();
        $result = $query->where('post_id', '=', $id)->get('*');
        return $result;
    }
    public function createComment($id, Request $request)
    {
        $query = Comments::query();
        $keys = $request->all();
        $keys['post_id'] = $id;
        $result = $query->create($keys);
        return $result;
    }
    public function getCategories($id)
    {
        $query = Posts::query();
        $result = $query->where('id', '=', $id)->get('categories');
        return $result[0]['categories'];
    }
    public function getLikes($id)
    {
        $query = Likes::query();
        $result = $query->where('post_id', '=', $id)->get('*');
        return $result;
    }
    public function create(Request $request)
    {
        $query = Posts::query();
        $data = $request->all();
        if (isset($data['categories']))
            $data['categories'] = json_encode($data['categories']);
        $result = $query->create($data);
        return $result;
    }
    public function createLike($id, Request $request)
    {
        $query = Likes::query();
        $keys = $request->all();
        $keys['post_id'] = $id;
        $result = $query->create($keys);
        return $result;
    }
    public function update($id, Request $request)
    {
        $data = $request->all();
        $query = Posts::query()->where('id', '=', $id);
        $result = array();
        if (isset($data['title']))
            array_push($result, $query->update(['title' => $data['title']]));
        if (isset($data['status']))
            array_push($result, $query->update(['status' => $data['status']]));
        if (isset($data['content']))
            array_push($result, $query->update(['content' => $data['content']]));
        if (isset($data['categories']))
            array_push($result, $query->update(['categories' => $data['categories']]));
        foreach ($result as $key)
            if ($key == 0)
                return ["ok" => false];
        return ["ok" => true];
    }
    public function delete($id)
    {
        $query = Posts::query();
        $result = $query->where('id', '=', $id)->delete();
        return $result;
    }
    public function deleteLike($id)
    {
        $query = Likes::query();
        $result = $query->where('post_id', '=', $id)->delete();
        return $result;
    }
}
