modules = require('../../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.httpGetAsync +
        modules.session +
        modules.styles +
        `<script>
            var meta = {};

            var loadState = "loading";
            var errorMessage = "";

            session.onAuthChanged((state, userMeta) => {
                if (state) {
                    if (userMeta.uid === window.location.pathname.split("/")[3]) {
                        document.getElementById("delete-modal-button").style.display = "inline";
                    }

                    let req = window.location.origin + "/api/essays/essay/${req.params.user}/${encodeURIComponent(req.params.name)}/meta";
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            loadState = "authorized";
                            meta = JSON.parse(res);
                            console.log(meta);

                            document.getElementById("title").innerText = meta.title;
                            document.getElementById("loaded").style.display = "inline";
                        } else {
                            console.error(res);
                        }
                    });
                } else {
                    loadState = "unauthorized";
                    errorMessage = "No authentication";
                }
            });

            function download() {
                if (loadState === "authorized") {
                    window.location.href = (window.location.origin + "/api/essays/essay/${req.params.user}/${encodeURIComponent(req.params.name)}/data.json");
                }
            }

            function openDeleteModal() {
                document.getElementById("delete-modal").style.display = "block";
            }

            function closeDeleteModal() {
                document.getElementById("delete-modal").style.display = "none";
            }

            window.onclick = function(event) {
                let deleteModal = document.getElementById("delete-modal")
                if (event.target == deleteModal) {
                    deleteModal.style.display = "none";
                }
            }

            function onDeleteInputUpdate(e) {
                let input = e.target.value.split("/");
                document.getElementById("delete-button").disabled = !(input.length === 2 && input[0] === "${req.params.user}" && input[1] === "${encodeURIComponent(req.params.name)}");
            }

            function deleteEssay() {
                let req = (window.location.origin + "/api/essays/essay/${req.params.user}/${encodeURIComponent(req.params.name)}/delete");
                httpGetAsync(req, (res, err) => {
                    if (!err) {
                        console.log("Repo successfully deleted");
                        window.location.href = (window.location.origin + "/w/profile/${req.params.user}");
                    } else {
                        console.error(res);
                    }
                });
            }

            function onLoad() {
                document.getElementById("delete-input").addEventListener('input', onDeleteInputUpdate);
            }
        </script>`,
        modules.topNav +
        `<div id="loaded" style="display: none;">
            <h1 id="title">No Title</h1>
            <a href="/w/essays/essay/${req.params.user}/${encodeURIComponent(req.params.name)}/edit">Edit</a>
            <a href="javascript:download()">Download</a>
            <a href="javascript:openDeleteModal()" id="delete-modal-button">Delete</a>
        </div>
        <div id="delete-modal" class="modal">
            <div class="modal-content">
                <span class="modal-close-button" onclick="closeDeleteModal()">&times;</span>
                <span>Are you sure you want to delete this essay?</span><br/>
                <span>Please enter the your UID followed by slash and the essay name.</span><br/>
                <input type="text" id="delete-input" style="width: 90%" placeholder="ex: GitHub-MDQ6VXNlcjE2OTgxMjgz/wacc-essay"/>
                <input type="button" style="width: 9%" value="Delete" onclick="deleteEssay()" id="delete-button" disabled>
            </div>
        </div>`,
        ``,
        `onload="onLoad()"`
    ));
};