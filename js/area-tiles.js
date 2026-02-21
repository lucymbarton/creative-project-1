(function () {
  var mtc = document.getElementById('mtc');
  var h8 = document.getElementById('h8');
  var manvel = document.getElementById('manvel');
  var sealy = document.getElementById('sealy');
  var galvy = document.getElementById('galvy');
  var mocity = document.getElementById('mocity');
  var jcgm = document.getElementById('jcgm');
  var fw = document.getElementById('fw');

  function changeInfo(event) {
    var id = event.target.id;
    if (id === 'mtc') mtc.innerHTML = '<img src="/images/mtcdropoff.jpg"/><h2>Provo MTC</h2><p> March 11, 2020 - March 28, 2020 </p>';
    if (id === 'h8') h8.innerHTML = '<img src="/images/onemonth.jpeg"/><h2>Houston 8</h2><p> March 28, 2020 - April 20, 2020 </p>';
    if (id === 'manvel') manvel.innerHTML = '<img src="/images/hnaCrookston.jpg"/><h2>Manvel</h2><p> April 20, 2020 - July 12, 2020 </p>';
    if (id === 'sealy') sealy.innerHTML = '<img src="/images/sealycomps.jpg"/><h2>Sealy</h2><p> July 12, 2020 - December 28, 2020 </p>';
    if (id === 'galvy') galvy.innerHTML = '<img src="/images/galvy.jpg"/><h2>Galveston</h2><p> December 28, 2020 - March 21, 2021 </p>';
    if (id === 'mocity') mocity.innerHTML = '<img src="/images/mocity.jpg"/><h2>Missouri City</h2><p> March 21, 2021 - April 12, 2021 </p>';
    if (id === 'jcgm') jcgm.innerHTML = '<img src="/images/jcgm.jpg"/><h2>Jones Creek/Grand Mission</h2><p> April 12, 2021 - July 26, 2021 </p>';
    if (id === 'fw') fw.innerHTML = '<img src="/images/friendswood.jpeg"/><h2>Friendswood</h2><p> July 26, 2021 - August 16, 2021 </p>';
  }
  function clearInfo(event) {
    var id = event.target.id;
    if (id === 'mtc') mtc.innerHTML = '<img src="/images/mtcdropoff.jpg"/><h2>Provo MTC</h2>';
    if (id === 'h8') h8.innerHTML = '<img src="/images/onemonth.jpeg"/><h2>Houston 8</h2>';
    if (id === 'manvel') manvel.innerHTML = '<img src="/images/hnaCrookston.jpg"/><h2>Manvel</h2>';
    if (id === 'sealy') sealy.innerHTML = '<img src="/images/sealycomps.jpg"/><h2>Sealy</h2>';
    if (id === 'galvy') galvy.innerHTML = '<img src="/images/galvy.jpg"/><h2>Galveston</h2>';
    if (id === 'mocity') mocity.innerHTML = '<img src="/images/mocity.jpg"/><h2>Missouri City</h2>';
    if (id === 'jcgm') jcgm.innerHTML = '<img src="/images/jcgm.jpg"/><h2>Jones Creek/Grand Mission</h2>';
    if (id === 'fw') fw.innerHTML = '<img src="/images/friendswood.jpeg"/><h2>Friendswood</h2>';
  }

  [mtc, h8, manvel, sealy, galvy, mocity, jcgm, fw].forEach(function (el) {
    if (el) {
      el.addEventListener('mouseenter', changeInfo);
      el.addEventListener('mouseleave', clearInfo);
    }
  });
})();
