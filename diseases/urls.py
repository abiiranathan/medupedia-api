from rest_framework.routers import DefaultRouter

from .views import DiseaseViewSet, SymptomViewSet, SignViewSet, UserViewSet

router = DefaultRouter()

router.get_api_root_view().cls.__name__ = "Diseases API"
router.get_api_root_view().cls.__doc__ = "Developed by Yo Medical Files(U) Ltd"

app_name = 'diseases'

router.register("symptoms", SymptomViewSet, basename='symptoms')
router.register("signs", SignViewSet, basename='signs')
router.register("diseases", DiseaseViewSet, basename='diseases')
# router.register("users", UserViewSet, basename='users')

urlpatterns = router.urls
