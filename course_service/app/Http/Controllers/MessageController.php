<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $messages = Message::all();
        $data = [
            'messages' => $messages,
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
        //
        $message = new Message;
        $message->sender_id = $request->sender_id;
        $message->receiver_id = $request->receiver_id;
        $message->message = $request->message;
        $message->save();
        $data = [
            'message' => 'Created sucessfully',
            'message' => $message,
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
        $message = Message::find($id);
        $data = [
            'message' => $message,
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
        $message = Message::find($id);
        $message->sender_id = $request->sender_id;
        $message->receiver_id = $request->receiver_id;
        $message->message = $request->message;
        $message->save();
        $data = [
            'message' => 'Updated sucessfully',
            'message' => $message,
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
        $message = Message::find($id);
        $message->is_active = 0;
        $message->save();
         $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }
}
