<template>
  <footer class="lp2-footer q-px-xl q-py-xl text-white">
    <div class="footer-container row q-col-gutter-xl">
      <div class="col-12 col-md-4">
        <div class="text-h6 text-bold flex items-center q-mb-md">
          <q-icon name="mdi-calendar-star" color="primary" class="q-mr-sm" size="32px" />
          <span>Agenda<span class="text-primary">Pro</span></span>
        </div>
        <p class="opacity-70 q-pr-xl">
          La plataforma definitiva para profesionales y negocios modernos. 
          Gestiona, escala y crece sin fricciones.
        </p>
        <div class="flex q-gutter-md q-mt-lg">
          <q-icon name="mdi-facebook" size="24px" class="social-icon" />
          <q-icon name="mdi-twitter" size="24px" class="social-icon" />
          <q-icon name="mdi-instagram" size="24px" class="social-icon" />
          <q-icon name="mdi-linkedin" size="24px" class="social-icon" />
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="text-subtitle1 text-bold q-mb-md">Producto</div>
        <div class="footer-links">
          <div class="footer-link">Características</div>
          <div class="footer-link">Soluciones</div>
          <div class="footer-link">Precios</div>
          <div class="footer-link">Actualizaciones</div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="text-subtitle1 text-bold q-mb-md">Compañía</div>
        <div class="footer-links">
          <div class="footer-link">Sobre Nosotros</div>
          <div class="footer-link">Contacto</div>
          <div class="footer-link">Blog</div>
          <div class="footer-link">Carreras</div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="text-subtitle1 text-bold q-mb-md">Recursos</div>
        <div class="footer-links">
          <div class="footer-link">Documentación</div>
          <div class="footer-link">Soporte</div>
          <div class="footer-link">Privacidad</div>
          <div class="footer-link">Términos</div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="text-subtitle1 text-bold q-mb-md">Contacto</div>
        <div class="footer-links">
          <div class="footer-link">info@agendapro.com</div>
          <div class="footer-link">+123 456 789</div>
          <div class="footer-link">Madrid, España</div>
        </div>
      </div>

      <div class="col-12 q-mt-xl pt-lg border-top">
        <div class="flex justify-between items-center opacity-50">
          <span class="text-caption">© 2026 AgendaPro. Todos los derechos reservados.</span>
          <div class="flex q-gutter-md">
            <span class="text-caption cursor-pointer">Política de Cookies</span>
            <span class="text-caption cursor-pointer">Seguridad</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.lp2-footer {
  background-color: #1d3557;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-link {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-link:hover {
  opacity: 1;
  color: var(--q-primary);
  transform: translateX(4px);
}

.social-icon {
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-icon:hover {
  opacity: 1;
  color: var(--q-primary);
  transform: scale(1.2);
}

.border-top {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
