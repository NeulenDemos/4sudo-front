<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Models\Likes;
use Illuminate\Http\Request;

class CommentsController extends Controller
{
    public function get($id)
    {
        $query = Comments::query();
        $result = $query->where('id', '=', $id)->get('*');
        return $result;
    }
    public function getLikes($id)
    {
        $query = Likes::query();
        $result = $query->where('comment_id', '=', $id)->get('*');
        return $result;
    }
    public function createLike($id, Request $request)
    {
        $query = Likes::query();
        $keys = $request->all();
        $keys['comment_id'] = $id;
        $result = $query->create($keys);
        return $result;
    }
    public function update($id, Request $request)
    {
        $data = $request->all();
        $query = Comments::query()->where('id', '=', $id);
        $result = array();
        if (isset($data['content']))
            array_push($result, $query->update(['content' => $data['content']]));
        foreach ($result as $key)
            if ($key == 0)
                return json_encode(["ok" => false]);
        return json_encode(["ok" => true]);
    }
    public function delete($id)
    {
        $query = Comments::query();
        $result = $query->where('id', '=', $id)->delete();
        return $result;
    }
    public function deleteLike($id)
    {
        $query = Likes::query();
        $result = $query->where('comment_id', '=', $id)->delete();
        return $result;
    }
}
