<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\notification;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $notifications = Notification::all();
        $data = [
            'notifications' => $notifications,
            'status' => 200
        ];
        return response($data,$data['status']);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $notification = new Notification;
        $notification->user_id = $request->user_id;
        $notification->message = $request->input('description');
        $notification->link_url = $request->input('link_url');
        $notification->is_read = $request->input('is_read');
        $notification->save();
        $data = [
            'message' => 'Created sucessfully',
            'notification' => $notification,
            'status' => 200
        ];
        return response($data,$data['status']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $notification = Notification::find($id);
        $data = [
            'notification' => $notification,
            'status' => 200
        ];
        return response($data,$data['status']);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $notification = Notification::find($id);
        $notification->user_id = $request->user_id;
        $notification->message = $request->input('description');
        $notification->link_url = $request->input('link_url');
        $notification->is_read = $request->input('is_read');
        $notification->save();
        $data = [
            'message' => 'Updated sucessfully',
            'notification' => $notification,
            'status' => 200
        ];
        return response($data,$data['status']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $notification = Notification::find($id);
        $notification->is_active = 0;
        $notification->save();
         $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }
}
