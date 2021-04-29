<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function getAll()
    {
        $query = Users::query();
        $result = $query->get('*');
        return $result;
    }
    public function get($id)
    {
        $query = Users::query();
        $result = $query->get('*')->where('id', '=', $id);
        return $result;
    }
    public function create(Request $request)
    {
        $query = Users::query();
        $result = $query->create($request->all());
        return $result;
    }
}
