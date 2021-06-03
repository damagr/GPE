using System.Web.Http;
using System.Web.Http.Cors;

namespace GPE
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            config.EnableCors();

            // Configurar rutas en los controlers para tener por ejemplo 2 Gets iguales
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);

            // Configuración y servicios de Web API
            // Configure Web API para usar solo la autenticación de token de portador.
            //config.SuppressDefaultHostAuthentication();
            //config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
        }
    }
}
