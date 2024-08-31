$(document).ready(function () {
  cargarLogin();

  function cargarLogin() {
    $("#contenido").html("<div id='inicioLogin'><p id='titulo1'>Inicie Sesión</p><input id='usuario' placeholder='*Usuario'></input><div id='inicioPass'><input type='password' id='password' placeholder='*Contraseña'><button id='btnVer'><span class='material-symbols-outlined icon_eye'>visibility</span></button></div><label><input type='checkbox' id='cbox1' value='checkbox1'/>Recordar</label><div id='errores'></div><button id='btnEnviar'>Entrar</button><a id='crear'>Crear Cuenta</a></div>");
    $(".cocinando1").hide();
    $(".nombreApp").hide();
    // Método para ver contraseña al pulsar el ojo.
    let password = document.getElementById('password');
    let btnVer = document.getElementById('btnVer');
    let click = false;

    btnVer.addEventListener('click', (e) => {
      if (!click) {
        password.type = 'text'
        click = true
      } else if (click) {
        password.type = 'password'
        click = false
      }
    })

    // Método para recordar login
    var codigo = `if (localStorage.chkbx && localStorage.chkbx != '') {
      $('#cbox1').attr('checked', 'checked');
      $('#usuario').val(localStorage.usrname);
      $('#password').val(localStorage.pass);
    } else {
      $('#cbox1').removeAttr('checked');
      $('#usuario').val('');
      $('#password').val('');
    }
  
    $('#cbox1').click(function () {
  
      if ($('#cbox1').is(':checked')) {
        // Aquí se guarda
        localStorage.usrname = $('#usuario').val();
        localStorage.pass = $('#password').val();
        localStorage.chkbx = $('#cbox1').val();
      } else {
        localStorage.usrname = '';
        localStorage.pass = '';
        localStorage.chkbx = '';
      }
    });`;
  
    var key = CryptoJS.enc.Utf8.parse('1234567890123456'); // Clave de 16 bytes
    var iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // IV de 16 bytes
  
    // Encriptar el código
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(codigo), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    localStorage.encryptedCodigo = encrypted.toString();
  
    // Para desencriptar
    var decrypted = CryptoJS.AES.decrypt(localStorage.encryptedCodigo, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    var originalCodigo = decrypted.toString(CryptoJS.enc.Utf8);
    console.log(originalCodigo); // Muestra el código original desencriptado

    $(document).ready(function () {
      $("#btnEnviar").click(function () {
        // Obtener valor del campo usuario y eliminar espacios en blanco
        var usuario = $("#usuario").val().trim();
        var password = $("#password").val().trim();

        // Verificar si los campos están vacíos
        if (usuario === "" || password === "") {
          $("input").css("border-color", "red")
          $("#errores").html("<a>Complete todos los campos</a>");
          return;
        }

        // Encriptar la contraseña
       /* var encryptedPassword = md5(password);   (Encripta la contraseña en el localhost, pero me envia los datos encripados a la bbdd y me da los datos como nullo*/
        

        // Enviar los datos encriptados
        $.post('funciones.php', { accion: "loggeo", usuario: usuario, password }, function (data) {
          console.log(data);

          $("#usuario").val("");
          $("#password").val("");

          if (data.respuesta != "") {
            cargarResultado();
          } else {
            $("#errores").html("<a>Los datos son incorrectos</a>");
          }
        });
      });

      $("#crear").click(function () {
        $("#errores").html(""); // Borrar el mensaje de error al pulsar "crear cuenta"
        cargarRegistro();
      });

      $("#recuperar").click(function () {
        recuperarPass();
      });
    });
  }

  // Función para cargar el formulario de registro
  function cargarRegistro() {
    $("#contenido").html("<div id='pantallaInscribirse'><p id='titulo2'>Inscribete</p><input id='usuario1' placeholder='*Usuario'><input id='email' type='email' placeholder='*Email'></input><div id='Pass'><div><input type='password' id='password1' placeholder='*Contraseña'></div></div><button id='btnInscribirme'>Inscribirme</button><a id='volverLogin'>Ya tengo cuenta</a></div>");
    $(".cocinando1").hide();
    $(".nombreApp").hide();
    // Evento para volver al formulario de inicio de sesión
    $("#volverLogin").click(function () {
      $("#errores").html(""); // Borrar el mensaje de error al pulsar "ya tengo cuenta cuenta"
      cargarLogin();
    });

    // Evento para registrar un nuevo usuario
    $("#btnInscribirme").click(function () {
      usuario = $("#usuario1").val();
      password = $("#password1").val();
      email = $("#email").val();

      $.post('funciones.php', { accion: "registro", usuario1: usuario, password1: password, email: email }, function (data) {
        console.log(data);

        $("#usuario1").val("");
        $("#password1").val("");
        $("#email").val("");

        if (data.respuesta != "") {
          $("#errores").html("<a>Los datos son Correctos</a>");
        } else {
          $("#errores").html("<a>Error al inscribirse</a>");
        }
      });
    });
  }

  // Función para cargar los resultados de la búsqueda
  function cargarResultado() {
    $("#contenido").html("<div id='inputBuscador'><button id='btnRefrescar'><span class='material-symbols-outlined icon_refresh'>refresh</span></button><button id='btnBack'><span class='material-symbols-outlined icon_back'>arrow_back</span></button><div id='divInInput'><button id='btnBuscar'><span class='material-symbols-outlined icon_search'>search</span></button><input id='buscador' type='search' placeholder='¿Qué quieres buscar?'><button id='btnLogout'><span class='material-symbols-outlined icon_logout'>logout</span></button></input><button id='btnRecepi'>Recetas</button><button id='btnAlimentos'>Alimentos</button></div></div><table id='resultadosBusqueda'><div id='carga'>Cargando...</div><img src='ayuda.png' class='img_buscar'></table>");

    // Esconder el mensaje de carga al iniciar el html para que solo se muestre al pulsar btnBuscar y btnBack
    $("#btnAlimentos").css("background-color", "rgb(73 58 32)");
    $("#btnAlimentos").css("color", "white");
    $("#btnAlimentos").css("border-radius", "5px");
    $("#carga").hide();
    $("#btnBack").hide();
    $(".cocinando").hide();
    $(".cocinando1").show();
    $(".nombreApp").show();
    // Evento para volver al formulario de inicio de sesión
    $("#btnLogout").click(function () {
      $(".cocinando").show();
      cargarLogin();
    });

    $("#btnRefrescar").click(function () {
      $(".cocinando").show();
      cargarResultado();
    });

    // Evento para mostrar las recetas
    $("#btnRecepi").click(function () {
      mostrarRecepi();
    });

    // Evento para realizar la búsqueda
    $("#btnBuscar").click(function () {
      // Muestra Cargando...
      $("#carga").show();
      $(".img_buscar").hide();

      var busqueda = $("#buscador").val();
      var api = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=' + busqueda + '&search_simple=1&action=process&json=true';

      $.get(api)
        .done(function (data) {
          $("#resultadosBusqueda").empty();

          if (data.products.length > 0) {
            data.products.forEach(function (product) {
              var imagenURL = product.image_url;
              if (imagenURL) {
                var productName = product.product_name;
                var productDetailsLink = "<a class='info' data='" + product.code + "'> (Ver mas detalles del producto)</a>";
                $("#resultadosBusqueda").append("<tr><td><img class='imagenesBusqueda' src='" + imagenURL + "'></td><td>" + productName + productDetailsLink + "</td></tr>");
                $('img_url').each(function () {
                  $(this).wrap("<div class='imagen-contenedor'></div>");
                });
              }
            });
          } else {
            $("#resultadosBusqueda").append("<p>No se encontraron resultados.</p>");
          }
        })
        .fail(function (xhr, status, error) {
          console.error(status);
          console.error(error);
        })
        .always(function () {
          // Oculta el mensaje de carga después de 1 segundos después de cargar los resultados
          setTimeout(function () {
            $("#carga").hide();
          }, 1000);
        });
    });
    // Función para mostrar información detallada del producto
    function mostrarInfoAlimentos(codigo) {
      var api = 'https://us.openfoodfacts.org/api/v0/product/' + codigo;

      $.get(api)
        .done(function (data) {
          $("#resultadosBusqueda").empty();

          if (data.status === 1) {
            var product = data.product;
            var details = "<div id='detallesProducto'><img src='supermercado.png' class='img_supermarket'><a class='tituloDetallesAli'>Detalles del Producto</a><ul>";
            details += "<li><h4>Nombre:</h4>" + product.product_name + "</li>";
            details += "<li><h4>Marca:</h4>" + product.brands + "</li>";
            details += "<li><h4>Categoría:</h4>" + product.categories + "</li>";
            details += "<li><h4>Etiquetas:</h4>" + product.labels + "</li>"
            details += "<li><h4>Origenes:</h4>" + product.origins + "</li>"
            details += "<li><h4>Lugare de Fabricación:</h4>" + product.manufacturing_places + "</li>"
            details += "<li><h4>Codigo EMB:</h4>" + product.emb_codes + "</li>"
            details += "<li><h4>Almacen:</h4>" + product.store + "</li>"
            details += "<li><h4>Alèrgenos:</h4>" + product.allergens + "</li>"
            details += "<li><h4>Trazos:</h4>" + product.traces + "</li>"
            details += "<li><h4>Contiene:</h4>" + product.contains + "</li>"
            details += "<li><h4>Almacen:</h4>" + product.does_not_contain + "</li>"
            details += "</ul></div>";
            $("#resultadosBusqueda").append(details);


          } else {
            $("#resultadosBusqueda").append("<a>No se encontraron detalles sobre este producto.</a>");
          }
        })
        .fail(function (_xhr, status, error) {
          console.error(status);
          console.error(error);
        });

      $("#btnBack").click(function () {
        cargarResultado();
      });

      $("#btnLogout").click(function () {
        cargarLogin();
      });
    }

    // Delegación de eventos para ver más detalles del producto
    $(document).on("click", ".info", function () {
      var productId = $(this).attr("data");
      console.log("codigo", productId);
      mostrarInfoAlimentos(productId);
    });
  }

  // Función para mostrar información detallada de la receta
  function mostrarRecepi() {
    $("#contenido").html("<div id='inputBuscador'><button id='btnBack'><span class='material-symbols-outlined icon_back'>arrow_back</span></button><div id='divInInput'><button id='btnBuscar'><span class='material-symbols-outlined icon_search'>search</span></button><input id='buscador' type='search' placeholder='¿Qué quieres buscar?'><button id='btnLogout'><span class='material-symbols-outlined icon_logout'>logout</span></button></input><button id='btnRecepi'>Recetas</button><button id='btnAlimentos'>Alimentos</button></div></div><div id='busEspecifico'><a id='btnPollo'>Pollo</a><a id='btnCerdo'>Cerdo</a><a id='btnTernera'>Ternera</a><a id='btnSalmon'>Salmón</a></div><table id='resultadosBusqueda'><img src='ayuda.png' class='img_buscar'></table><img src='ayuda.png' class='img_buscar'>");

    //Valor para modificar el CSS al usar el elemento click
    var nuevoCSS = { "color": 'grey' };

    //Cambia el color de background dejando esn otro color el boton seleccionado
    $("#btnRecepi").css("background-color", "rgb(73 58 32)");
    $("#btnRecepi").css("color", "white");
    $("#btnRecepi").css("border-radius", "5px");
    $("#carga").hide();

    // Evento para volver al formulario de inicio de sesión
    $("#btnLogout").click(function () {
      $(".cocinando").show();
      cargarLogin();
    });

    // Evento para volver a los resultados de la búsqueda
    $("#btnBack").click(function () {
      cargarResultado();
    });

    // Evento para mostrar alimentos
    $("#btnAlimentos").click(function () {
      cargarResultado();
    });

    // Funciones para buscar recetas específicas
    $("#btnPollo").click(function () {
      $("#btnPollo").css(nuevoCSS);
      buscarEspecifico("chicken");
      $(".img_buscar").hide();
    });

    $("#btnCerdo").click(function () {
      $("#btnCerdo").css(nuevoCSS);
      buscarEspecifico("pork");
      $(".img_buscar").hide();
    });

    $("#btnTernera").click(function () {
      $("#btnTernera").css(nuevoCSS);
      buscarEspecifico("beef");
      $(".img_buscar").hide();
    });

    $("#btnSalmon").click(function () {
      $("#btnSalmon").css(nuevoCSS);
      buscarEspecifico("salmon");
      $(".img_buscar").hide();
    });

    //Con esta funcio elimina los estilos al pulsar otro btn, dejando el estilo nuevo solo al btn selecionado
    function limpiarEstilos() {
      $("#busEspecifico a").css("color", "");
    }
    // Restablece los estilos cuando se hace clic en un botón específico
    $("#busEspecifico a").click(function () {
      limpiarEstilos();
      $(this).css("color", "grey");
    });


    // Evento para buscar recetas al hacer clic 
    $("#btnBuscar").click(function () {
      // Muestra Cargando...
      $("#carga").show();

      var busqueda = $("#buscador").val();
      var api = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + busqueda;

      $.get(api)
        .done(function (data) {
          $("#resultadosBusqueda").empty();

          if (data && data.meals) {
            data.meals.forEach(function (meal) {
              var productName = meal.strMeal;
              var productThumb = meal.strMealThumb;
              var productId = meal.idMeal;
              var productDetailsLink = "<a class='infoR' data='" + productId + "'>" + productName + "</a>";
              $("#resultadosBusqueda").append("<tr><td><img class='imagenesMeals' src='" + productThumb + "'></td><td>" + productDetailsLink + "</td></tr>");
              $('.imagenesMeals').wrap("<div class='imagen-contenedor1'></div>");
            });
          } else {
            $("#resultadosBusqueda").append("<p>No se encontraron resultados.</p>");
          }
          $("#carga").hide();
        })
        .fail(function () {
          $("#resultadosBusqueda").append("<p>Error al obtener los datos.</p>");
          $("#carga").hide();
        });
    });

    // Delegación de eventos para ver más detalles de la receta
    $(document).on("click", ".infoR", function () {
      var productId = $(this).attr("data");
      mostrarInfo(productId);
    });
  }

  // Función para realizar la búsqueda específica
  function buscarEspecifico(termino) {
    $("#carga").show(); // Muestra el mensaje de carga

    var api = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + termino;

    $.get(api)
      .done(function (data) {
        $("#resultadosBusqueda").empty();

        if (data && data.meals) {
          data.meals.forEach(function (meal) {
            var productName = meal.strMeal;
            var productThumb = meal.strMealThumb;
            var productId = meal.idMeal;
            var productDetailsLink = "<a class='infoR' data='" + productId + "'>" + productName + "</a>";
            $("#resultadosBusqueda").append("<tr><td><img class='imagenesMeals' src='" + productThumb + "'></td><td>" + productDetailsLink + "</td></tr>");
            $('.imagenesMeals').wrap("<div class='imagen-contenedor1'></div>");
          });
        } else {
          $("#resultadosBusqueda").append("<p>No se encontraron resultados.</p>");
        }
        $("#carga").hide(); // Oculta el mensaje de carga
      })
      .fail(function () {
        $("#resultadosBusqueda").append("<p>Error al obtener los datos.</p>");
        $("#carga").hide(); // Oculta el mensaje de carga en caso de error
      });
  }

  // Función para mostrar información detallada del producto
  function mostrarInfo(productId) {
    var api = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + productId;

    $.get(api)
      .done(function (data) {
        $("#resultadosBusqueda").empty();

        if (data && data.meals && data.meals.length > 0) {
          var meal = data.meals[0];
          var detalles = "<div id='detallesReceta'><img src='cocinandome.png' class='cocinandome'><a class='tituloDetalles'>Detalles de la Receta</a><ul>";
          detalles += "<li><h4>Nombre: </h4>" + meal.strMeal + "</li>";
          detalles += "<li><h4>Categoría: </h4>" + meal.strCategory + "</li>";
          detalles += "<li><h4>Área de Origen: </h4>" + meal.strArea + "</li>";
          detalles += "<li><h4>Instrucciones: </h4>" + meal.strInstructions + "</li>";
          detalles += "<li><h4>Ingredientes: </h4></li>";
          detalles += "<ul>";

          // Iterar sobre los ingredientes y medidas
          for (var i = 1; i <= 20; i++) {
            var ingrediente = meal["strIngredient" + i];
            var medida = meal["strMeasure" + i];
            if (ingrediente) {
              detalles += "<li>" + ingrediente;
              // Si hay medida, agregarla
              if (medida) {
                detalles += " - " + medida;
              }
              detalles += "</li>";
            } else {
              // Si no hay más ingredientes, salir del bucle
              break;
            }
          }
          detalles += "</ul></ul></div>";
          $("#resultadosBusqueda").append(detalles);
        } else {
          $("#resultadosBusqueda").append("<a>No se encontraron detalles sobre esta receta.</a>");
        }
      })
  }

  // Función para obtener detalles del producto
  function obtenerDetallesProducto(productCode) {
    var api = 'https://world.openfoodfacts.org/api/v0/product/' + productCode + '.json';

    $.get(api)
      .done(function (data) {
        var product = data.product;
        var productName = product.product_name;
        var imageURL = product.image_url;
        var ingredients = product.ingredients_text;
        var nutriments = product.nutriments;

        var detallesHTML = "<div><h2>" + productName + "</h2><img src='" + imageURL + "'><p><strong>Ingredientes:</strong> " + ingredients + "</p><p><strong>Nutrición:</strong> " + JSON.stringify(nutriments) + "</p></div>";

        $("#resultadosBusqueda").html(detallesHTML);
      });
  }
});

