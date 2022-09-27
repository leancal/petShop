const pruebas = document.getElementById('pruebas')
const jugueteriaHTML = document.getElementById('jugueteriaHTML')
const farmaciaHTML = document.getElementById('farmaciaHTML')

const app = Vue.
createApp({
    data() {
      return {
        productos:[],
        juguetes: [],
        medicamentos: [],
        productosTotales: [],
        productosOrdenados: [],
        inputBusqueda: "",
        filtroSeleccionado: "",
        productosDestacados: [],
        productosDeInteres:[],
        carrito: [],
        productoEnCarrito:{},
        formatoPrecio : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }),
      };

    },
    created(){
        fetch("https://apipetshop.herokuapp.com/api/articulos")
        .then((respuesta) => respuesta.json())
        .then((json)=>{
            this.productos = json.response
            this.juguetes = this.productos.filter(producto =>producto.tipo == "Juguete")
            this.medicamentos = this.productos.filter(producto =>producto.tipo == "Medicamento")
            this.productosOrdenados = this.productos
            this.productosTotales = this.productos
            this.productosDestacados = this.juguetes.filter(producto =>producto.stock<5)
            if (pruebas){
              this.productosOrdenados = this.juguetes
              this.productosTotales = this.juguetes
            } else if (jugueteriaHTML) {        
              this.productosOrdenados = this.juguetes
              this.productosTotales = this.juguetes
              this.productosDeInteres = this.medicamentos.sort(() => Math.random() - 0.5)
            } else if (farmaciaHTML)  { 
              this.productosOrdenados = this.medicamentos
              this.productosTotales = this.medicamentos
              this.productosDeInteres = this.juguetes.sort(() => Math.random() - 0.5)
            }
            if(localStorage.getItem('carrito') != null){
              this.carrito= JSON.parse(localStorage.getItem("carrito"))
            } 
        })
    },

    mounted() {},

    methods: {

      //------------------------------------------------- Funcionan
      ordenarAlfabeticamenteA(){
        this.productosOrdenados = this.productosTotales.sort((a,b) => { 
          if (a.nombre==b.nombre){ 
            return 0;
          }
          if (a.nombre < b.nombre) { 
            return -1; 
          }
          return 1;
        }) 
      },

        ordenarAlfabeticamenteZ(){                                  
          this.productosOrdenados = this.productosTotales.sort((a, b) =>{ 
          if (a.nombre==b.nombre){ 
            return 0;
          }
          if (a.nombre > b.nombre) { 
            return -1; 
          }
          return 1;
        });
      },

      ordenarPrecioMayor(){
        this.productosOrdenados = this.productosTotales.sort((a,b) => b.precio - a.precio)
      },

      ordenarPrecioMenor(){
        this.productosOrdenados = this.productosTotales.sort((a,b) => a.precio - b.precio)
      },

      filtroBusqueda(arrProd){
        this.productosOrdenados = arrProd.filter(prod => prod.nombre.toLowerCase().includes(this.inputBusqueda.toLowerCase()))
      },

      agregarAlCarrito(producto){
        let idDelProducto = producto._id
        let productoEncontrado = this.carrito.find(item => item._id == idDelProducto)
        if(!productoEncontrado){
          this.productoEnCarrito = {
            _id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1,
            stock: producto.stock -= 1,
          };
          this.carrito.push(this.productoEnCarrito)

        } else {
          console.log(productoEncontrado)
          productoEncontrado.cantidad++
          productoEncontrado.stock--
        console.log(productoEncontrado)
      }
      localStorage.setItem('carrito',JSON.stringify(this.carrito))
      },

      eliminarDelCarrito(producto){
        let idDelProducto = producto._id
        let productoEncontrado = this.carrito.find(item => item._id === idDelProducto)
        if(productoEncontrado){
          productoEncontrado = {
            _id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: producto.cantidad -= 1,
            stock: producto.stock += 1
          }
          if(productoEncontrado.cantidad < 1){
            this.carrito = this.carrito.filter(item => item._id != idDelProducto)
          }
        }
        localStorage.setItem('carrito',JSON.stringify(this.carrito))
      },

      eliminarDelCarritoTotal(){
        this.carrito = []
        localStorage.setItem("carrito", JSON.stringify(this.carrito))
      },
      
      costoTotal(){
        let subtotal=[]

        this.carrito.forEach(item =>{
          let costo = item.precio*item.cantidad
          subtotal.push(costo)
        })

        return subtotal.reduce((a,b) => a+b,0)
      },
      
      agradecimiento(){
        Swal.fire('Enviado!', '', 'success')
      },

      alertaAgregadoAlCarrito(producto){
        let agregadoAlCarrito = ' agregado efectivamente!'
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: producto.nombre + agregadoAlCarrito,
          showConfirmButton: false,
          timer: 1000
        })
      }


    },

    computed: {
      filtroDoble(){ 
        if(this.inputBusqueda != ""){
            this.filtroBusqueda(this.productosTotales)
        }else{
          this.productosOrdenados = this.productosTotales
        }
    }

    },
  }).mount('#app')


