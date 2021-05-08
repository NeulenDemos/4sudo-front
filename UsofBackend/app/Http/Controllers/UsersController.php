<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function getAll()
    {
        // $user_id = auth()->user()->id;
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
        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        $result = $query->create($data);
        return $result;
    }
    public function avatar(Request $request)
    {
        $user_id = auth()->user()->id;
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('storage/images'), $imageName);
        $query = User::query()->where('id', '=', $user_id);
        $result = $query->update(['picture' => $imageName]);
        return $result;
    }
    public function update($id, Request $request)
    {
        $user_id = auth()->user()->id;
        if ($id != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $data = $request->all();
        $query = User::query()->where('id', '=', $id);
        $result = array();
        if (isset($data['login']))
            array_push($result, $query->update(['login' => $data['login']]));
        if (isset($data['password']))
            array_push($result, $query->update(['password' => Hash::make($data['password'])]));
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
                return ["ok" => false];
        return ["ok" => true];
    }
    public function delete($id)
    {
        $user_id = auth()->user()->id;
        if ($id != $user_id && !User::isAdmin())
            return response()->json(['error' => 'Forbidden'], 403);
        $query = User::query();
        $result = $query->where('id', '=', $id)->delete();
        return $result;
    }
}
