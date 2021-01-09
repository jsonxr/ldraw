import { parse } from '../../src/shared/parser/parse';

describe('0 !DATA', () => {
  it('should add data', () => {
    const parsed = parse(`
      0 !DATA sticker.png
      0 !: iVBORw0KGgoAAAANSUhEUgAAAFAAAAB4CAIAAADqjOKhAAAAAXNSR0IArs4c6QAAAARnQU1BAACx
      0 !: jwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEUSURBVHhe7du9DcIwFABhk5WgQLSsQM0UjMEU
      0 !: 1BQsQIsoYAt6NkAYxQV/JQ7WvfuKkFTR6UmOFJzR9bJLkXTlNwyD6QymM5ju5Tl8m67KGUt3XJcz
      0 !: J/yY8HZ/6C8BFvNZPoaesMF0BtMZTGcwncF0BtMZTGcwncF0BtMZTGcwnf8t0bmLh85gOoPpDKYz
      0 !: mM5gOoPpDKYzmM5gunDBf3tN+/zqNKt367cbOeGUTstxf1nJZHPOx68T/u3XB5/7/zMXLTqD6Qym
      0 !: M5jOYDqD6QymM5jOYDqD6QymM5jOYDqD6QymM5jOYLpwwW3t8ajBXTxtTHgwLlp0BtMZTGcwncF0
      0 !: BtMZTNfKZzyDiT3hCFy06IIFp3QH/CBMh66aBy4AAAAASUVORK5CYII=
    `);

    expect(parsed?.data.length).toEqual(1);
    const data = parsed!.data![parsed!.data.length - 1];
    expect(data.name).toEqual('sticker.png');
    expect(data.strings.length).toEqual(7);
  });
});
