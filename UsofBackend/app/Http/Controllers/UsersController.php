<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function getAll()
    {
        $query = User::query();
        $result = $query->get('*');
        return $result;
    }
    public function get($id)
    {
        $query = User::query();
        $result = $query->where('id', '=', $id)->get('*');
        return $result;
    }
    public function create(Request $request)
    {
        $query = User::query();
        $result = $query->create($request->all());
        return $result;
    }
    public function avatar(Request $request)
    {
        // pass
    }
    public function update($id, Request $request)
    {
        $data = $request->all();
        $query = User::query()->where('id', '=', $id);
        $result = array();
        if (isset($data['username']))
            array_push($result, $query->update(['username' => $data['username']]));
        if (isset($data['password']))
            array_push($result, $query->update(['password' => $data['password']]));
        if (isset($data['name']))
            array_push($result, $query->update(['name' => $data['name']]));
        if (isset($data['email']))
            array_push($result, $query->update(['email' => $data['email']]));
        if (isset($data['rating']))
            array_push($result, $query->update(['rating' => $data['rating']]));
        if (isset($data['role']))
            array_push($result, $query->update(['role' => $data['role']]));
        foreach ($result as $key)
            if ($key == 0)
                return json_encode(["ok" => false]);
        return json_encode(["ok" => true]);
    }
    public function delete($id)
    {
        $query = User::query();
        $result = $query->where('id', '=', $id)->delete();
        return $result;
    }
}
