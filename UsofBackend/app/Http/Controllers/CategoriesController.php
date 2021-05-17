<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Posts;
use App\Models\User;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function getAll()
    {
        $result = Categories::get();
        return $result;
    }
    public function get($id)
    {
        $result = Categories::whereKey($id)->get();
        return $result;
    }
    public function getPosts($id)
    {
        $result = Posts::where('categories', 'LIKE', "%\"$id\"%")->get();
        return $result;
    }
    public function create(Request $request)
    {
        if (!User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = Categories::create($request->all());
        return $result;
    }
    public function update($id, Request $request)
    {
        if (!User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $data = $request->all();
        $query = Categories::whereKey($id);
        $result = array();
        if (isset($data['title']))
            array_push($result, $query->update(['title' => $data['title']]));
        if (isset($data['description']))
            array_push($result, $query->update(['description' => $data['description']]));
        foreach ($result as $key)
            if ($key == 0)
                return response('0', 400);
        return response('1', 200);
    }
    public function delete($id)
    {
        if (!User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $result = Categories::whereKey($id)->delete();
        return $result;
    }
}
