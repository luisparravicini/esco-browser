/**
 * Galeria para el reporte de olas de La Esco.
 * Programado por Luis Parravicini
 * Mas informacion en http://ktulu.com.ar/blog/
 */

var base_photo_url = 'http://www.laesco.com.ar/imagenes/pronosticos/';

var Esco = new Object();

Esco.photos_id = "#photos";
Esco.months = [ "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre",
    "Diciembre" ];
Esco.strip_id = 'filmstrip';

Esco.pad2 = function(value) {
  return (value < 10 ? '0' : '') + value;
};

Esco.photo_url = function(day) {
  var aux = (day.getFullYear()+"").substring(2, 4) +
    this.pad2(day.getMonth() + 1) +
    this.pad2(day.getDate());

  return base_photo_url + aux + '.jpg';
};

Esco.humanize_date = function(day) {
  return day.getDate() + " de " + this.months[day.getMonth() + 1] + " del " +
    day.getFullYear();
};

Esco.add_day = function(day) {
  var photos = $(this.photos_id);
  var humanized = this.humanize_date(day);

  $('.' + this.strip_id).append(
    '<li><img src="' + this.photo_url(day) + '" alt="' + humanized +
      '" title="' + humanized  + '" />'  +
      ' <div class="panel-overlay">' +
      ' <h2>' + humanized + '</h2> ' +
      ' <p>Foto por <a href="http://www.laesco.com.ar" target="_blank">La Esco</a></p> ' +
      ' </div></li>');
};

Esco.init = function() {
  this.currentDate = new Date();
  this.initSlideShow();
  this.initCalendarNav();
};

Esco.initSlideShow = function() {
  var photos = $(this.photos_id);
  photos.empty();
  photos.append("<ul class='" + this.strip_id + "'></ul>");

//TODO usar this.currentDate
  var date = new Date(this.currentDate);
  date.setDate(1);
  var end_month = date.getMonth();
  while (date.getMonth() == end_month) {
    this.add_day(date);
    date.setDate(date.getDate() + 1);
  }

  this.initGallery();
};

Esco.initGallery = function() {
  $(this.photos_id).galleryView({
		panel_width: 609,
		panel_height: 319,
		frame_width: 50,
		frame_height: 30,
    paused: true,
	});
};

Esco.initCalendarNav = function() {
  var nav = $('#calendar_nav');

  var ynav = "year-nav";
  var mnav = "month-nav";

  nav.append($(this.yearNavUI()).wrap("div").addClass(ynav));
  nav.append($(this.monthNavUI()).wrap("div").addClass(mnav));

  this.initYearNav($('.' + ynav));
  this.initMonthNav($('.' + mnav));
};

Esco.initYearNav = function(container) {
  var esco = this;
  container.find('li').bind("click", function() {
    esco.changeYear(container, $(this));
    return false;
  });
}

Esco.initMonthNav = function(container) {
  var esco = this;
  container.find('a').bind("click", function() {
    esco.changeMonth(container, $(this));
    return false;
  });
}

Esco.changeMonth = function(container, elem) {
  container.find('a').removeClass('selected');
  elem.addClass('selected');
  // dejo que se pueda cambiar al mismo mes que el actual
  // como parche para que solucionar el bug cuando se ven las fotos
  // alargadas (que pedorro)

  this.currentDate.setMonth(elem.attr('monthId'));
  this.initSlideShow();
}

Esco.changeYear = function(container, elem) {
  var new_year = elem.text();
  if (this.currentDate.getFullYear() == new_year)
    return;

  container.find('li').removeClass('selected');
  elem.addClass('selected');
  this.currentDate.setYear(new_year);
  this.initSlideShow();
}

Esco.yearNavUI = function() {
  var this_year = this.currentDate.getFullYear();

  var items = "<ul>";
  for (var i = 2007; i <= this_year; i++) {
    items += "<li"
    if (i == this_year)
      items += " class='selected'";
    items += ">";
    items += "<a href='#'>" + i + "</a>";
    items += "</li>";
  }
  items += "</ul>";
 
  return items; 
};

Esco.monthNavUI = function() {
  var this_month = this.currentDate.getMonth();

  var result = "<table cellspacing='0' cellpadding='0'>";
  $.each(this.months, function(i, elem) {
    if (i > 0 && i % 4 == 0)
      result += "</tr>";
    if (i % 4 == 0)
      result += "<tr>";

    result += "<td>";
    result += "<a href='#' monthId='" + i + "'";
    if (this_month == i)
      result += " class='selected'";
    result += ">" + elem
    result += "</a>";

    result += "</td>";
  });
  result += "</tr></table>";

  return result;
};

