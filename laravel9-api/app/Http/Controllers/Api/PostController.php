<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::latest()->paginate(5);
        return new PostResource(true, 'List Data Post', $posts);
    }

    public function store(Request $request)
    {
        // define validator rules
        $validator      = Validator::make($request->all(), [
            'image'     => 'required|image|mimes:png,jpg,jpeg',
            'title'     => 'required',
            'content'   => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $image = $request->file('image');
        $image->storeAs('public/posts', $image->hashName());
        // create posix_times
        $post = Post::create([
            'image'     => $image->hashName(),
            'title'     => $request->title,
            'content'   => $request->content
        ]);
        // return response
        return new PostResource(true, 'Data Post Berhasil ditambahkan', $post);
    }


    public function show(Post $post)
    {
        return new PostResource(true, 'Data Post Ditemukan!', $post);
    }



    public function update(Request $request, Post $post)
    {
        $validator      = Validator::make($request->all(), [
            'title'     => 'required',
            'content'   => 'required'
        ]);
        // check if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->storeAs('public/posts', $image->hashName());
            Storage::delete('public/posts/' . $post->image);
            // update posts with new image
            $post->update([
                'image'     => $image->hashName(),
                'title'     => $request->title,
                'content'   => $request->content
            ]);
        } else {
            // update posts without image
            $post->update([
                'title'     => $request->title,
                'content'   => $request->content
            ]);
        }
        return new PostResource(true, 'Data Post Berhasil di tambahkan!', $post);
    }

    public function destroy(Post $post)
    {
        // delete image
        Storage::dleete('public/posts/' . $post->image);
        // delete post
        $post->delete();
        return new PostResource(true, 'Data Post Berhasil DiHapus!', $post);
    }
}
