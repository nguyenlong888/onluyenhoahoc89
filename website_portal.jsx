import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [image, setImage] = useState(null);
  const [introText, setIntroText] = useState("");
  const [currentPage, setCurrentPage] = useState("home");

  function handleLogin(username, password) {
    if (username === "admin" && password === "admin") {
      setIsAdmin(true);
      setIsLoggedIn(true);
    } else if (username && password) {
      setIsLoggedIn(true);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage("home");
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Giới thiệu</h2>
              <Textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                placeholder="Nhập phần giới thiệu..."
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Hình ảnh</h2>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
              />
              {image && <img src={image} alt="Preview" className="mt-2 w-full rounded-xl shadow" />}
            </div>

            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-semibold">Mục lục</h2>
              <div className="flex gap-4 mt-2">
                <Button variant="outline" onClick={() => setCurrentPage("tai-lieu")}>Tài liệu</Button>
                <Button variant="outline" onClick={() => setCurrentPage("tho-hoa-hoc")}>Thơ hóa học</Button>
                <Button variant="outline" onClick={() => setCurrentPage("album-anh")}>Album ảnh</Button>
              </div>
            </div>
          </div>
        );
      case "tai-lieu":
        return <TaiLieuPage isLoggedIn={isLoggedIn} isAdmin={isAdmin} />;
      case "tho-hoa-hoc":
        return <ThoHoaHocPage isAdmin={isAdmin} />;
      case "album-anh":
        return <AlbumAnhPage isAdmin={isAdmin} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-700">🌐 Cổng Thông Tin Trực Tuyến</h1>

        {!isLoggedIn ? (
          <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-center">🔐 Đăng nhập</h2>
              <Input placeholder="Tên đăng nhập" id="username" />
              <Input type="password" placeholder="Mật khẩu" id="password" />
              <Button className="w-full" onClick={() => handleLogin("admin", "admin")}>Đăng nhập</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant={currentPage === "home" ? "default" : "outline"} onClick={() => setCurrentPage("home")}>Trang chủ</Button>
              <Button variant={currentPage === "tai-lieu" ? "default" : "outline"} onClick={() => setCurrentPage("tai-lieu")}>Tài liệu</Button>
              <Button variant={currentPage === "tho-hoa-hoc" ? "default" : "outline"} onClick={() => setCurrentPage("tho-hoa-hoc")}>Thơ hóa học</Button>
              <Button variant={currentPage === "album-anh" ? "default" : "outline"} onClick={() => setCurrentPage("album-anh")}>Album ảnh</Button>
              <Button variant="destructive" onClick={handleLogout}>Đăng xuất</Button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              {renderPage()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaiLieuPage({ isLoggedIn, isAdmin }) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("documents");
    if (stored) setDocuments(JSON.parse(stored));
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...documents, file.name];
      setDocuments(updated);
      localStorage.setItem("documents", JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📚 Trang Tài liệu</h1>
      {isAdmin && <Input type="file" className="w-full" onChange={handleUpload} />}
      {isLoggedIn ? (
        <ul className="list-disc list-inside text-blue-800">
          {documents.map((doc, idx) => (
            <li key={idx}>{doc}</li>
          ))}
        </ul>
      ) : (
        <div className="text-red-600">Bạn cần được duyệt tài khoản để tải tài liệu.</div>
      )}
    </div>
  );
}

function ThoHoaHocPage({ isAdmin }) {
  const [poem, setPoem] = useState("");

  useEffect(() => {
    const storedPoem = localStorage.getItem("poem");
    if (storedPoem) setPoem(storedPoem);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setPoem(value);
    localStorage.setItem("poem", value);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">✍️ Trang Thơ hóa học</h1>
      {isAdmin ? (
        <Textarea value={poem} onChange={handleChange} className="w-full" />
      ) : (
        <div className="whitespace-pre-wrap bg-gray-100 p-4 rounded-xl text-gray-700">{poem}</div>
      )}
    </div>
  );
}

function AlbumAnhPage({ isAdmin }) {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("albums");
    if (stored) setAlbums(JSON.parse(stored));
  }, []);

  const addAlbum = () => {
    if (newAlbum) {
      const updated = [...albums, newAlbum];
      setAlbums(updated);
      localStorage.setItem("albums", JSON.stringify(updated));
    }
    setNewAlbum("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🖼️ Album Ảnh</h1>
      {isAdmin && (
        <div className="flex gap-2">
          <Input value={newAlbum} onChange={(e) => setNewAlbum(e.target.value)} placeholder="Tên album mới" />
          <Button onClick={addAlbum}>Thêm</Button>
        </div>
      )}
      <ul className="list-disc list-inside text-blue-700">
        {albums.map((album, idx) => (
          <li key={idx}>{album}</li>
        ))}
      </ul>
    </div>
  );
}
