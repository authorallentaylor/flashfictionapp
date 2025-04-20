// A simple React-based flash fiction app (MVP)
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function FlashFictionApp() {
  const [stories, setStories] = useState([]);
  const [current, setCurrent] = useState({ title: '', byline: '', text: '', image: null });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  const saveStory = () => {
    if (current.text.trim().split(/\s+/).length > 1000) return alert('Story must be 1,000 words or less');
    if (editingIndex !== null) {
      const updated = [...stories];
      updated[editingIndex] = current;
      setStories(updated);
      setEditingIndex(null);
    } else {
      setStories([...stories, current]);
    }
    setCurrent({ title: '', byline: '', text: '', image: null });
  };

  const editStory = (index) => {
    setCurrent(stories[index]);
    setEditingIndex(index);
  };

  const deleteStory = (index) => {
    const updated = stories.filter((_, i) => i !== index);
    setStories(updated);
    if (editingIndex === index) setCurrent({ title: '', byline: '', text: '', image: null });
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Flash Fiction Writer</h1>
      <Tabs defaultValue="write" value={editingIndex !== null ? 'write' : undefined}>
        <TabsList className="mb-4">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="stories">My Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          <Input
            name="title"
            placeholder="Story Title"
            className="mb-4"
            value={current.title}
            onChange={handleChange}
          />
          <Input
            name="byline"
            placeholder="Byline (e.g., Jane Doe)"
            className="mb-4"
            value={current.byline}
            onChange={handleChange}
          />
          <Textarea
            name="text"
            placeholder="Write your story here (max 1,000 words)"
            rows={12}
            className="mb-4"
            value={current.text}
            onChange={handleChange}
          />
          <Input
            type="file"
            accept="image/*"
            className="mb-4"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                setCurrent((prev) => ({ ...prev, image: reader.result }));
              };
              reader.readAsDataURL(file);
            }}
          />
          {current.image && <img src={current.image} alt="Uploaded" className="mb-4 max-h-60 rounded" />}
          <Button onClick={saveStory} className="mt-4">{editingIndex !== null ? 'Update' : 'Save'} Story</Button>
        </TabsContent>

        <TabsContent value="stories">
          {stories.length === 0 ? (
            <p className="text-gray-500">No stories yet.</p>
          ) : (
            <div className="space-y-4">
              {stories.map((story, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-1">{story.title}</h2>
                    {story.byline && <p className="text-sm italic mb-2">By: {story.byline}</p>}
                    {story.image && <img src={story.image} alt="Story Visual" className="mb-4 max-h-60 rounded" />}
                    <p className="whitespace-pre-wrap mb-4">{story.text}</p>
                    <div className="flex gap-2">
  <Button size="sm" onClick={() => editStory(i)}>Edit</Button>
  <Button size="sm" variant="destructive" onClick={() => deleteStory(i)}>Delete</Button>
  <Button size="sm" onClick={() => {
    const text = encodeURIComponent(`${story.title}

${story.text}

By: ${story.byline}`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  }}>Share to X</Button>
  <Button size="sm" onClick={() => {
    const link = `${window.location.href}#story-${i}`;
    navigator.clipboard.writeText(link).then(() => alert('Link copied to clipboard!'));
  }}>Copy Link</Button>
</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
