const myArr = [
    { type: 'one', number: 1, fiedld: 'aaa' },
    { type: 'one', number: 2, field: 'bb' },
    { type: 'two', number: 2, field: 'xxx' },
    { type: 'two', number: 1, field: 'zz' },
    { type: 'two', number: 3, field: 'y' },
];

var result = Object.values(myArr.reduce(function(r, e) {
  if(!r[e.type]) r[e.type] = e;
  else if(e.number > r[e.type].number) r[e.type] = e;
  return r;
}, {}))

console.log(result)