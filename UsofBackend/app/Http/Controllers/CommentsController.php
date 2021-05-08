<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use App\Models\Likes;
use App\Models\User;
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
        $user_id = auth()->user()->id;
        $query = Likes::query();
        $data = $request->all();
        $data['comment_id'] = $id;
        $data['user_id'] = $user_id;
        $result = $query->create($data);
        return $result;
    }
    public function update($id, Request $request)
    {
        $user_id = auth()->user()->id;
        $data = $request->all();
        $query = Comments::query()->where('id', '=', $id);
        $result = $query->get(['user_id'])->all();
        if (!$result)
            return response()->json(['error' => 'Not found'], 404);
        if ($result[0]['user_id'] != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
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
        $user_id = auth()->user()->id;
        $query = Comments::query()->where('id', '=', $id);
        $result = $query->get(['user_id'])->all();
        if (!$result)
            return response()->json(['error' => 'Not found'], 404);
        if ($result[0]['user_id'] != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = $query->delete();
        return $result;
    }
    public function deleteLike($id)
    {
        $user_id = auth()->user()->id;
        $query = Likes::query()->where('comment_id', '=', $id);
        $result = $query->get(['user_id'])->all();
        if (!$result)
            return response()->json(['error' => 'Not found'], 404);
        if ($result[0]['user_id'] != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = $query->delete();
        return $result;
    }
}
