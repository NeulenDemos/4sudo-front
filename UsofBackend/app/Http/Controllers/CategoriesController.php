<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Posts;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function getAll()
    {
        $query = Categories::query();
        $result = $query->get('*');
        return $result;
    }
    public function get($id)
    {
        $query = Categories::query();
        $result = $query->where('id', '=', $id)->get('*');
        return $result;
    }
    public function getPosts($id)
    {
        $query = Posts::query();
        $result = $query->where('categories', 'LIKE', "%\"$id\"%")->get('*');
        return $result;
    }
    public function create(Request $request)
    {
        $query = Categories::query();
        $result = $query->create($request->all());
        return $result;
    }
    public function update($id, Request $request)
    {
        $data = $request->all();
        $query = Categories::query()->where('id', '=', $id);
        $result = array();
        if (isset($data['title']))
            array_push($result, $query->update(['title' => $data['title']]));
        if (isset($data['description']))
            array_push($result, $query->update(['description' => $data['description']]));
        foreach ($result as $key)
            if ($key == 0)
                return json_encode(["ok" => false]);
        return json_encode(["ok" => true]);
    }
    public function delete($id)
    {
        $query = Categories::query();
        $result = $query->where('id', '=', $id)->delete();
        return $result;
    }
}
