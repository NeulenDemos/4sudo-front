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
        $result = Comments::whereKey($id)->get();
        return $result;
    }
    public function getLikes($id)
    {
        $result = Likes::where('comment_id', '=', $id)->get();
        return $result;
    }
    public function createLike($id, Request $request)
    {
        $user_id = auth()->user()->id;
        $result  = Likes::where('comment_id', '=', $id)->where('user_id', '=', $user_id)->get()->all();
        if ($result)
            return response()->json(['error' => 'Forbidden'], 403);
        $data = $request->all();
        $data['comment_id'] = $id;
        $data['user_id'] = $user_id;
        $result = Likes::create($data);
        return $result;
    }
    public function update($id, Request $request)
    {
        $user_id = auth()->user()->id;
        $data = $request->all();
        $query = Comments::whereKey($id);
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
                return response('0', 400);
        return response('1', 200);
    }
    public function delete($id)
    {
        $user_id = auth()->user()->id;
        $query = Comments::whereKey($id);
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
        $query = Likes::where('comment_id', '=', $id);
        $result = $query->get(['user_id'])->all();
        if (!$result)
            return response()->json(['error' => 'Not found'], 404);
        if ($result[0]['user_id'] != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = $query->delete();
        return $result;
    }
}
