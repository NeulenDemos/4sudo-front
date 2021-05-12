<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use App\Models\Comments;
use App\Models\Likes;
use App\Models\User;
use App\Models\Subscriptions;
use App\Filters\PostFilters;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    public function getAll(Request $request)
    {
        $filters = new PostFilters($request);
        $query =  $filters->apply(Posts::query());
        if ($filters->page_num === null)
            $result = $query->get();
        else
            $result = $query->paginate($filters->posts_num, ['*'], 'page', $filters->page_num);
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
        $user_id = auth()->user()->id;
        $status = Posts::query()->where('id', '=', $id)->where('status', '=', TRUE)->get()->all();
        if (!$status)
            return response('0', 400);
        $query = Comments::query();
        $data = $request->all();
        $data['post_id'] = $id;
        $data['user_id'] = $user_id;
        $result = $query->create($data);
        $subs = Subscriptions::query()->where('post_id', '=', $id)->get(['user_id'])->all();
        if ($subs) {
            $author = User::query()->where('id', '=', $user_id)->get(['name'])->all()[0]['name'];
            $title = Posts::query()->where('id', '=', $id)->get(['title'])->all()[0]['title'];
            $subs_id = [];
            foreach ($subs as $value)
                array_push($subs_id, $value['user_id']);
            $users = User::query()->whereKey($subs_id)->get(['email', 'name'])->all();
            foreach ($users as $user) {
                MailController::sendSubscriptionNotification($user['email'], $user['name'], $author, $data['content'], $id, $title);
            }
        }
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
        $user_id = auth()->user()->id;
        $query = Posts::query();
        $data = $request->all();
        $data['user_id'] = $user_id;
        if (isset($data['categories']))
            $data['categories'] = json_encode($data['categories']);
        $result = $query->create($data);
        return $result;
    }
    public function createLike($id, Request $request)
    {
        $user_id = auth()->user()->id;
        $query = Likes::query();
        $data = $request->all();
        $data['post_id'] = $id;
        $data['user_id'] = $user_id;
        $result = $query->create($data);
        if ($data['type'] == 'like')
            $query = Posts::query()->where('id', '=', $id)->increment('rating');
        else if ($data['type'] == 'dislike')
            $query = Posts::query()->where('id', '=', $id)->decrement('rating');
        return $result;
    }
    public function createFavorite($id)
    {
        $user_id = auth()->user()->id;
        $query = User::query()->where('id', '=', $user_id);
        $favorites = json_decode($query->get(['favorites'])->all()[0]['favorites']);
        $result = 0;
        $id = intval($id);
        if (!in_array($id, $favorites)) {
            array_push($favorites, $id);
            $result = $query->update(['favorites' => json_encode($favorites)]);
        }
        return $result;
    }
    public function createSubscribe($id)
    {
        $user_id = auth()->user()->id;
        $id = intval($id);
        $query = Subscriptions::query();
        $result = $query->where('user_id', '=', $user_id)->where('post_id', '=', $id)->get()->all();
        if ($result)
            return response('0', 400);
        $result = $query->create(['user_id' => $user_id, 'post_id' => $id]);
        return $result;
    }
    public function update($id, Request $request)
    {
        $user_id = auth()->user()->id;
        $data = $request->all();
        $query = Posts::query()->where('id', '=', $id);
        $result = $query->get(['user_id'])->all();
        if (!$result)
            return response()->json(['error' => 'Not found'], 404);
        if ($result[0]['user_id'] != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = array();
        if (isset($data['title']))
            array_push($result, $query->update(['title' => $data['title']]));
        if (isset($data['status']))
            array_push($result, $query->update(['status' => $data['status']]));
        if (isset($data['content']))
            array_push($result, $query->update(['content' => $data['content']]));
        if (isset($data['categories']))
            array_push($result, $query->update(['categories' => json_encode($data['categories'])]));
        foreach ($result as $key)
            if ($key == 0)
                return ["ok" => false];
        return ["ok" => true];
    }
    public function delete($id)
    {
        $user_id = auth()->user()->id;
        $query = Posts::query()->where('id', '=', $id);
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
        $query = Likes::query()->where('post_id', '=', $id);
        $result = $query->get(['user_id'])->all();
        if (!$result)
            return response()->json(['error' => 'Not found'], 404);
        if ($result[0]['user_id'] != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = $query->delete();
        $query = Posts::query()->where('id', '=', $id)->decrement('rating');
        return $result;
    }
    public function deleteFavorite($id)
    {
        $user_id = auth()->user()->id;
        $query = User::query()->where('id', '=', $user_id);
        $favorites = json_decode($query->get(['favorites'])->all()[0]['favorites']);
        $keys = array_keys($favorites, intval($id), true);
        $result = 0;
        if (isset($keys[0])) {
            unset($favorites[$keys[0]]);
            $favorites = array_values($favorites);
            $result = $query->update(['favorites' => json_encode($favorites)]);
        }
        return $result;
    }
    public function deleteSubscribe($id)
    {
        $user_id = auth()->user()->id;
        $query = Subscriptions::query()->where('user_id', '=', $user_id)->where('post_id', '=', intval($id));
        $result = $query->delete();
        return $result;
    }
}
