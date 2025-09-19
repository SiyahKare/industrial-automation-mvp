
# Flutter UI Skeleton

Create the Flutter app in this folder:
```bash
flutter create ui
cd ui
flutter pub add web_socket_channel
```
Replace `lib/main.dart` with:
```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
void main() => runApp(const MaterialApp(home: Live()));
class Live extends StatefulWidget { const Live({super.key}); @override State<Live> createState()=>_LiveState(); }
class _LiveState extends State<Live> {
  late final WebSocketChannel ch; String val = "-";
  @override void initState(){ super.initState(); ch = WebSocketChannel.connect(Uri.parse('ws://localhost:8000/ws/stream'));
    ch.stream.listen((e){ final m=json.decode(e as String) as Map; final out=(m['nodes'] as Map)['OUT'] as Map?; setState(()=>val='${out?['value'] ?? '?'} ${out?['unit'] ?? ''}'); }); }
  @override Widget build(BuildContext c)=>Scaffold(appBar: AppBar(title: const Text('Live OUT')), body: Center(child: Text(val, style: const TextStyle(fontSize: 36)))); }
```
